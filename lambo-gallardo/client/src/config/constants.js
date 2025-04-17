import { swatch, fileIcon, ai, logocar, stylishcar,  headlight, tirerim, cardoor,text } from "../assets";

export const EditorTabs = [
  {
    name: "colorpicker",
    icon: swatch,
  },
  {
    name: "filepicker",
    icon: fileIcon,
  },
  {
    name: "aipicker",
    icon: ai,
  },
];

export const FilterTabs = [
  {
    name: "logoCar",
    icon: logocar,
  },
  {
    name: "stylishCar",
    icon: stylishcar,
  },
  {
    name: "headlights",
    icon: headlight,
  }
];

export const DecalTypes = {
  logo: {
    stateProperty: "logoDecal",
    filterTab: "logoCar",
  },
  full: {
    stateProperty: "fullDecal",
    filterTab: "stylishCar",
  },
};

export const DesignTabs = [
  {
    name: "Rims",
    icon: tirerim
  },
  {
    name: "Door",
    icon: cardoor
  },

  {
    name: "Text",
    icon: text
  },

]
