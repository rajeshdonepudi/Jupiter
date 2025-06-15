const AppFalconOneRocket = (props: any) => (
  <svg
    fill="#000000"
    width="100%"
    height="100%"
    viewBox="0 0 24 24"
    id="rocket"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}
  >
    <path
      id="secondary"
      d="M15.87,11A5.89,5.89,0,0,1,20,17H16"
      style={{
        fill: "none",
        stroke: props?.secondaryColor ?? "rgb(44, 169, 188)",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 1,
      }}
    />
    <path
      id="secondary-2"
      data-name="secondary"
      d="M8.13,11A5.89,5.89,0,0,0,4,17H8"
      style={{
        fill: "none",
        stroke: props?.secondaryColor ?? "rgb(44, 169, 188)",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 1,
      }}
    />
    <path
      id="primary"
      d="M15,20V18H9v2a1,1,0,0,0,1,1h4A1,1,0,0,0,15,20Zm.87-2C16.74,8,14,4.36,12.65,3.24a1,1,0,0,0-1.3,0C10,4.36,7.26,8,8.13,18Z"
      style={{
        fill: "none",
        stroke: props?.primaryColor ?? "rgb(0, 0, 0)",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 1,
      }}
    />
  </svg>
);
export default AppFalconOneRocket;
