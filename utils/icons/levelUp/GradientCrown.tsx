import React from "react";

const GradientCrown = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="70"
      viewBox="0 0 64 70"
      fill="none"
    >
      <g filter="url(#filter0_di_144_36308)">
        <circle cx="37" cy="33" r="11" fill="#1448FF" />
        <circle cx="37" cy="33" r="11" fill="url(#paint0_linear_144_36308)" />
        <circle cx="37" cy="33" r="10.5" stroke="#1448FF" />
        <circle
          cx="37"
          cy="33"
          r="10.5"
          stroke="url(#paint1_linear_144_36308)"
        />
      </g>
      <g clip-path="url(#clip0_144_36308)">
        <path
          d="M33.1072 36.6317C33.1072 36.7796 33.2271 36.8996 33.375 36.8996H41.4108C41.5587 36.8996 41.6787 36.7796 41.6787 36.6317V35.8281H33.1072V36.6317Z"
          fill="white"
        />
        <path
          d="M42.4823 29.9362C42.0386 29.9366 41.6791 30.2961 41.6787 30.7397C41.68 30.7723 41.6833 30.8049 41.6885 30.8371L39.3548 32.004L37.8196 29.8108C38.1957 29.5752 38.3095 29.0793 38.0738 28.7032C37.8382 28.3271 37.3422 28.2133 36.9662 28.4489C36.5902 28.6847 36.4763 29.1805 36.712 29.5566C36.7765 29.6594 36.8633 29.7464 36.9662 29.8108L35.431 32.004L33.0973 30.8371C33.1026 30.8049 33.1059 30.7723 33.1072 30.7397C33.1094 30.2959 32.7513 29.9344 32.3075 29.9322C31.8636 29.9301 31.5022 30.2881 31.5 30.7319C31.498 31.1393 31.8012 31.4837 32.2056 31.5334L33.1072 35.2933H41.6787L42.5802 31.5334C43.0197 31.4803 43.3329 31.081 43.2799 30.6416C43.2311 30.2383 42.8884 29.9352 42.4823 29.9362Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_di_144_36308"
          x="0"
          y="0"
          width="70"
          height="70"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-2" dy="2" />
          <feGaussianBlur stdDeviation="12" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_144_36308"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_144_36308"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="dilate"
            in="SourceAlpha"
            result="effect2_innerShadow_144_36308"
          />
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0106771 0 0 0 0 0.174167 0 0 0 0 0.5125 0 0 0 0.29 0"
          />
          <feBlend
            mode="darken"
            in2="shape"
            result="effect2_innerShadow_144_36308"
          />
        </filter>
        <linearGradient
          id="paint0_linear_144_36308"
          x1="46.5577"
          y1="24.7109"
          x2="22.8257"
          y2="40.061"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#50D5FF" />
          <stop offset="1" stop-color="#50D5FF" stop-opacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_144_36308"
          x1="46.5577"
          y1="24.7109"
          x2="33.1472"
          y2="40.3891"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#50D5FF" />
          <stop offset="1" stop-color="#50D5FF" stop-opacity="0" />
        </linearGradient>
        <clipPath id="clip0_144_36308">
          <rect
            width="11.7857"
            height="11.7857"
            fill="white"
            transform="translate(31.5 26.7148)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default GradientCrown;
