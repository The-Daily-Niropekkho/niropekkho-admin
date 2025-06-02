/* eslint-disable @typescript-eslint/no-explicit-any */
import fileObjectToLink from "./fileObjectToLink"

type FileObject = any // Replace with your actual file object type

export function getStringUrl(fileObject: FileObject): string {
  const linkResult = fileObjectToLink(fileObject)

  if (typeof linkResult === "string") {
    return linkResult
  }

  // If it's an object, try to extract the URL
  if (linkResult && typeof linkResult === "object") {
    const { url, server_url, cdn } = linkResult as { url?: string; server_url?: string; cdn?: string }
    return url || server_url || cdn || ""
  }

  return ""
}
