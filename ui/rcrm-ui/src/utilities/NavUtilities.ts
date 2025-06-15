const navigateToSecureArea = (path: string) => {
  return `/secure/${path}`;
};

export default {
  ToSecureArea: navigateToSecureArea,
};
