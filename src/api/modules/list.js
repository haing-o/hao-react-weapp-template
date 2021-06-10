import getUrl from "../api-config";
import http from "@/utils/httpRequest";

/**
 * 技术需求
 */

export const getDetail = async (id, params) => {
  return http(getUrl('list.detail') + `?id=${id}`, {}, {
    noData: true,
    ...params
  })
}
