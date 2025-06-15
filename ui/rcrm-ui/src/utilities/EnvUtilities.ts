const resolveAPIUrl = (endpointPath: string) => {
  return `${import.meta.env.VITE_API_BASE_URL}${endpointPath}`;
};

const resolveRootUrl = (endpointPath: string) => {
  return `${import.meta.env.VITE_API_ROOT_URL}${endpointPath}`;
};

const result = {
  GetApiURL: resolveAPIUrl,
  GetApiRootURL: resolveRootUrl,
};

export default result;
