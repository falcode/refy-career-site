export const stripHtmlTags = (text: string): string => text.replace(/(<([^>]+)>)/gi, "");