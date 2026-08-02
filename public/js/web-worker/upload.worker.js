/**
 * 大文件上传webwoker
 */

self.importScripts("/js/spark-md5.min.js");

self.onmessage = e => {
  const { chunks } = e.data;
  const spark = new SparkMD5.ArrayBuffer();
  const loadNext = (idx = 0) => {
    const chunk = chunks[idx];
    if (!chunk) {
      self.postMessage({
        hash: spark.end(),
      });
      return self.close();
    }
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunk);
    reader.onload = e => {
      spark.append(e.target.result);
      loadNext(++idx);
    };
  };
  loadNext();
};
