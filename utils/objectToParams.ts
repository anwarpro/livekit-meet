const objectToParams = (
  params: Record<string, string | number | boolean | null | undefined>
) => {
  const paramsStr = Object.keys(params)
    .reduce((acc, param) => {
      if (params[param]) {
        acc.push(`${param}=${encodeURIComponent(params[param]!)}`);
      }
      return acc;
    }, [] as string[])
    .join("&");
  return paramsStr ? `?${paramsStr}` : "";
};

export default objectToParams;
