/**
 * 请求路径
 */

const list = "/list";

const ApiList = {
  user: {
    loadUser: "/loadUser",
    switchLanguage: "/switch/language",
  },
  list: {
    list: list,
    detail: list + "/detail"
  }
}

const getUrl = (name = '') => {
  if (!name) { return '' }
  let pathList = name.split('.');
  let dataCfg;
  pathList.forEach(function (path) {
    dataCfg = dataCfg ? dataCfg[path] : ApiList[path];
  });
  return dataCfg;
}

export default getUrl;
