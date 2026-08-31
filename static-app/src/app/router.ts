export const getRoute = () => window.location.hash.replace(/^#/, "") || "/";

export const navigate = (path: string) => {
  if (window.location.hash === `#${path}`) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    return;
  }
  window.location.hash = path;
};
