const UpdateQueryParams = (
  navigate: any,
  currentSearchParams: URLSearchParams,
  newParams: Record<string, string | number | undefined>,
  options: { replace?: boolean } = { replace: true }
) => {
  const updated = new URLSearchParams(currentSearchParams);

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      updated.delete(key);
    } else {
      updated.set(key, String(value));
    }
  });

  navigate(`?${updated.toString()}`, options);
};

export default {
  UpdateQueryParams,
};
