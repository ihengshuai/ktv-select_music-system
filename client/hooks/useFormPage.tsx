import { isArray, isFunction } from "@hengshuai/helper";
import { FormInstance, FormProps } from "ant-design-vue";
// import { ValidateErrorEntity } from "ant-design-vue/es/form/interface";
import { computed, isReactive, ref, toRaw, watchEffect } from "vue";

import { IFormModel, IFormModelAlterItem, IFormModelItem, IFormRules } from "@/typings/common/form";
import { IDict } from "@/typings/common/type";

interface IUseForm<T extends IDict<any>, R = T> {
  /** 表单模型 */
  formModel: IFormModel<T>;
  /** 表单校验规则 */
  formRules?: IFormRules<T>;
  /** 表单属性 */
  baseProps?: FormProps | (() => FormProps);
  /** 初始化表单数据(通常获取服务器数据) */
  initFormData: (payload?: R) => Promise<R>;
  /** 提交表单 */
  onSubmit: (res: R) => any;
  /** 表单数据变化 */
  onDataChange?: (res: R) => any;
}

/**
 * 表单通用逻辑封装,提高开发效率。
 * 对于简单表单,提供 model、rules、initFormData、onSubmit 就足够了
 *  @example const formModel = reactive<IFormModel<IUser>>({
 *              name: {
 *                  value: null,
 *                  transform: (val) => `xx ${val}`
 *              },
 *              age: {
 *                  value: null,
 *                  field: "info.age", // 转换成 info:{age:xx}
 *                  // etc...
 *              }
 *      })
 * const formRules: IFormRules<IUser> = {
 *              age: {
 *                validator: (rule, value) => {
 *                  if (!value || isNaN(parseInt(value.value as unknown as string))) return Promise.reject("年龄不能为空");
                    return Promise.resolve();
 *                }
 *              }
 *              // etc...
 * }
 *
 * // 这里的泛型：
 * //   1. 第一个表示表单的数据类型，默认也等同为要提交给服务器的数据类型，如IUser
 * //   2. 第二个就表示要提交给服务器的数据模型，默认等同于第一个，根据情况提供(如有些form字段映射为后端其他字段)
 * const { formRef, formLoading, formProps, handleSubmitForm, 其他... } = useFormPage<IUser, IUserRes>({
 *              formModel,
 *              formRules,
 *              // 初始化表单数据(通常获取服务器数据)
 *              initFormData: async () => ({name: 'xxx'}),
 *              // 提交表单
 *              onSubmit: async (res) => {},
 *             // 表单数据变化(内部默认在表单的数据变化后会执行initFormModel来回显表单,如果提供了此函数,内部逻辑不再执行)
 *             onDataChange?: (res) => {}
 * })
 */
export function useFormPage<T extends IDict<any>, R = T>(param: IUseForm<T, R>) {
  const { formModel, baseProps, formRules = {}, initFormData, onSubmit, onDataChange } = param;

  if (!isReactive(formModel)) {
    throw new Error("model must be reactive");
  }

  // 当没有请求时不会显示loading
  const requestPendingList = ref<string[]>([]);

  // 表单数据
  const formData = ref<R>();
  const formLoading = ref(false);
  const formRef = ref<FormInstance>();
  const labelCol = { span: 4 };
  const wrapperCol = { span: 20 };

  const formProps = computed<FormProps>(() => ({
    model: formModel,
    rules: formRules,
    labelCol,
    wrapperCol,
    colon: false,
    ...(isFunction(baseProps) ? baseProps() : baseProps),
  }));

  launcher();

  function launcher() {
    // 表单原始数据(非model)变化时,执行回调
    watchEffect(() => {
      if (formData.value) {
        if (isFunction(onDataChange)) {
          clearModel();
          onDataChange?.(formData.value);
        } else {
          initFormModel(formData.value);
        }
      }
    });

    watchEffect(() => {
      if (!requestPendingList.value.length) {
        formLoading.value = false;
      } else {
        formLoading.value = true;
      }
    });
    loadFormData();
  }

  /** 初始化表单数据(通常服务器拉取) */
  async function loadFormData() {
    try {
      pushRequestList();
      const res = await initFormData(getFormValues());
      res && (formData.value = res);
    } finally {
      popRequestList();
    }
  }

  /**
   * 用来初始化model的值(初始化数据时不对真实数据做转换,遍历model以及根据field值来赋值)
   * @param data 用来映射填充model，通常是后端返回的数据
   * @param alterItem 特殊的属性特殊处理（属性必须属于model范畴，这里有类型提示）
   */
  function initFormModel(data: R, alterItem: IFormModelAlterItem<T, R> = {}): IFormModel<T> | null {
    if (!formModel) return null;
    const _model = formModel;
    Object.keys(_model).forEach((key: keyof T) => {
      const { field, isShow } = _model[key] as IFormModelItem;
      if (isShow === undefined || isShow?.()) {
        if (typeof alterItem?.[key] === "function") {
          if (field !== undefined) {
            const fields = field.split(".");
            let value = data;
            fields.forEach(k => {
              if (!value) return;
              // @ts-ignore
              value = value[k];
            });
            _model[key].value = alterItem?.[key]?.(value as T[keyof T], data);
          } else {
            // @ts-ignore
            _model[key].value = alterItem?.[key]?.(data[key], data);
          }
          return;
        } else {
          if (field !== undefined) {
            const fields = field.split(".");
            let value = data;
            fields.forEach(k => {
              if (!value) return;
              // @ts-ignore
              value = value[k];
            });
            // @ts-ignore
            value && (_model[key].value = value);
          } else {
            // @ts-ignore
            _model[key].value = data[key];
          }
        }
      }
    });
    return _model;
  }

  /** 获取表单某项值 */
  function getFormValueByField(k: keyof T): T[keyof T] {
    const _formModel = toRaw(formModel);
    const { value, transform, type } = _formModel[k] || {};
    if (transform) return transform?.(value!, _formModel);
    return toTypeValue(value, type);
  }

  /**
   * 获取表单的值，提交时没有错误时通过此方法获取需要请求的结果
   */
  function getFormValues(): R {
    const payload = {} as R;
    const _formModel = toRaw(formModel) as IFormModel<any>;
    Object.keys(_formModel).forEach(k => {
      const { value, type, field, isForm, isShow, transform } = _formModel[k] as IFormModelItem;
      if ((isShow === undefined || isShow()) && isForm !== false) {
        if (field !== undefined) {
          // 变成真实字段
          const fields = field.split(".");
          const fieldsLen = fields.length;
          let last = payload;
          fields.forEach((prop, idx) => {
            if (idx < fieldsLen - 1) {
              // @ts-ignore
              if (!last[prop]) {
                // @ts-ignore
                last[prop] = {};
              }
              // @ts-ignore
              last = last[prop];
            } else {
              // @ts-ignore
              last[prop] = transform !== undefined ? transform?.(value, _formModel) : toTypeValue(value, type);
            }
          });
        } else {
          // @ts-ignore
          payload[k] = transform !== undefined ? transform?.(value, _formModel) : toTypeValue(value, type);
        }
      }
    });
    return payload;
  }

  /** 提交表单 */
  async function handleSubmitForm() {
    const valid = await validateForm();
    if (!valid) return;
    try {
      pushRequestList();
      const payload = getFormValues();
      const res = await submitForm(payload);
      res && (formData.value = res);
    } finally {
      popRequestList();
    }
  }

  /** 提交表单 */
  async function submitForm(res: R): Promise<ReturnType<typeof onSubmit>> {
    return (await onSubmit?.(res)) || null;
  }

  /** 表单验证 */
  async function validateForm() {
    if (formRef?.value) {
      try {
        await formRef.value.validate();
        return true;
      } catch (error: unknown) {
        // const _error = error as ValidateErrorEntity<IFormModel<T>>;
        // console.log("error", _error);
        return false;
      }
    }
    return true;
  }

  /** 清空表单 */
  function clearModel() {
    const _model = toRaw(formModel);
    Object.keys(_model).forEach(k => {
      const { type, value } = _model[k];
      // @ts-ignore
      formModel[k].value = type === Array || isArray(value) ? [] : null;
    });
  }

  /** 清空不显示的表单的值 */
  function clearUnnecessaryModel() {
    const _model = toRaw(formModel);
    Object.keys(_model).forEach(k => {
      const item = _model[k];
      if (item.isShow !== undefined && !item.isShow()) {
        formModel[k].value = null;
      }
    });
  }

  /** model字段值类型转换 */
  function toTypeValue(val: any, type?: IFormModelItem["type"]) {
    if (!val) return val;
    if (type === Number) {
      const num = Number(val);
      return isNaN(num) ? null : num;
    } else if (type === Boolean) {
      return val === "true";
    } else if (type === Array) {
      return isArray(val) ? val : [val];
    } else {
      return val;
    }
  }

  function pushRequestList() {
    requestPendingList.value.push("");
  }
  function popRequestList() {
    requestPendingList.value.pop();
  }

  function toggleLoading() {
    requestPendingList.value = [];
    formLoading.value = !formLoading.value;
  }

  return {
    formRef,
    formData,
    formLoading,
    labelCol,
    wrapperCol,
    formProps,
    /**
     * 用来初始化model的值(初始化数据时不对真实数据做转换,遍历model以及根据field值来赋值)
     * @param data 用来映射填充model，通常是后端返回的数据
     * @param alterItem 特殊的属性特殊处理（属性必须属于model范畴，这里有类型提示）
     */
    initFormModel,
    /** 加载表单数据(通常是后端返回的数据) */
    loadFormData,
    /**
     * 获取表单的值，提交时没有错误时通过此方法获取需要请求的结果
     */
    getFormValues,
    /** 获取表单某项值 */
    getFormValueByField,
    /** 清空表单 */
    clearModel,
    /** 清空不显示的表单的值 */
    clearUnnecessaryModel,
    /** 提交表单 */
    handleSubmitForm,
    toggleLoading,
  };
}
