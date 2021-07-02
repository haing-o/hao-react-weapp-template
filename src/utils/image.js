import {BASE_URL} from "@/constants/baseUrl";

export const imgPreviewUrl = (url) => {
  return `${BASE_URL}/api-file${url}`
}
