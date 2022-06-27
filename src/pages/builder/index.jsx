import { useEffect, useState, useRef } from 'react';

import { Button, Icon, Dropdown, Popup, Modal } from 'semantic-ui-react';

import grapesjs from 'grapesjs';
import plugin from 'grapesjs-preset-webpage';
import basic from 'grapesjs-blocks-basic';
import forms from 'grapesjs-plugin-forms';
import pgexport from 'grapesjs-plugin-export';
import navbar from 'grapesjs-navbar';
import countdown from 'grapesjs-component-countdown';

import 'grapesjs/dist/css/grapes.min.css';
import './index.css';

import defaultPage from './default';

const svgNameList = ["form", "input", "textarea", "select", "button", "label", "checkbox", "radio"];
const panelList = [];
panelList[0] = [];
panelList[1] = ['ti ti-device-desktop', 'ti ti-device-tablet', 'ti ti-device-mobile'];
panelList[2] = ['ti ti-marquee-2', '', 'ti ti-arrows-maximize', 'ti ti-code', '', '', 'ti ti-file-import', 'ti ti-eraser'];
panelList[3] = ['ti ti-pencil', 'ti ti-settings', 'ti ti-layers-subtract', 'ti ti-layout-grid'];


function Builder() {
  const editorRef = useRef(null);

  const [pageContent, setpageContent] = useState(localStorage.getItem("gjsProject"));
  const [editor, setEditor] = useState(null);
  const [selPage, setSelPage] = useState(0);
  const [zIndex, setZIndex] = useState(4);
  const [show, setShow] = useState(false);
  const [pindex, setPindex] = useState(0);

  useEffect(() => {
    if (pageContent) {
      const editor = grapesjs.init({
        fromElement: true,
        container: '#gjs',
        storageManager: {
          type: 'local',
          autoload: true,
          autosave: true,
          stepsBeforeSave: 1,
          storeComponents: true,
          storeStyles: true,
          storeHtml: true,
          storeCss: true,
        },
        canvasCss:
          ".gjs-selected {outline: 2px dashed #567af8 !important;}  .gjs-hovered {border:2px red !important; outline: 2px dashed gray !important;} .gjs-dashed [data-gjs-highlightable] {outline:2px dashed gray ; outline-offset:-1px;}",
        plugins: [
          basic, plugin, forms, navbar, countdown, pgexport
        ],
        pluginsOpts: {
          [pgexport]: {
            addExportBtn: true,
            btnLabel: 'export',
            css: {
              'style.css': ed => ed.getCss(),
              'some-file.txt': 'My custom content',
            },
            img: async ed => {
              const images = await ed.getComponents();
              return images;
            },
            'index.html': ed => `<body>${ed.getHtml()}</body>`
          },
        },
        canvas: {
          styles: ['https://fonts.googleapis.com/css?family=Roboto:300,300i,400,400i,500,500i,700,700i|Open+Sans:300,300i,400,400i,500,500i,700,700i,800,800i,900,900i|Lato:300,300i,400,400i,500,500i,700,700i,800,800i,900,900i|Montserrat:300,300i,400,400i,500,500i,700,700i,800,80i,900,900i|Oswald:300,300i,400,400i,500,500i,700,700i,800,800i,900,900i|Source+Sans+Pro:300,300i,400,400i,500,500i,700,700i,800,800i,900,900i|Slabo+27px/13px:300,300i,400,400i,500,500i,700,700i,800,800i,900,900i|Raleway:400,400i,600,600i,700,700i,800,800i,900,900i|Poppins:400,400i,600,600i,700,700i,800,800i,900,900i|Josefin+Sans:100,100i,200,200i,300.300i.400,400i,600,600i,700,700i,800,800i,900,900i|Nunito:100,100i,200,200i,300.300i.400,400i,600,600i,700,700i,800,800i,900,900i&subset=latin,latin-ext']
        }
      });

      const styleManager = editor.StyleManager;
      const fontManager = editor.StyleManager.getProperty('typography', 'font-family');
      let fontOptions = fontManager.attributes.options;

      fontManager.set('list', fontOptions);
      styleManager.render();

      const panelManager = editor.Panels;
      let panels = panelManager.getPanels();

      panels.map((panel, index) => {
        panel.buttons.models.map((button, pindex) => {
          button.set('label', '');
          button.set('className', panelList[index][pindex]);
        })
        panels[index] = panel;
      });

      const blockManager = editor.Blocks;
      let blocks = blockManager.getAllVisible();
      blockManager.remove("column1");
      blockManager.remove("column2");
      blockManager.remove("column3");
      blockManager.remove("column3-7");
      blockManager.remove("navbar");
      blockManager.remove("video");
      blockManager.remove("countdown");
      blockManager.remove("custom-code");
      blockManager.remove("text");
      blockManager.remove("link");
      blockManager.remove("image");
      blockManager.remove("map");
      blockManager.remove("text-basic");
      blockManager.remove("link-block");
      blockManager.remove("quote");
      blockManager.remove("tabs");

      blocks.map((block, index) => {
        block.attributes.media = '<img src = "buildericons/' + svgNameList[index] + '.svg">';
        blocks[index] = block;
        if (block.attributes.label === "Form") {
          const formComponent = [
            {
              components: [
                { type: "label", components: "Name" },
                { type: "input", attributes: { name: "fullname" } }
              ]
            },
            {
              components: [
                { type: "label", components: "Email" },
                { type: "input", attributes: { type: "email", name: "email" } }
              ]
            },
            {
              components: [
                { type: "label", components: "Phone" },
                { type: "input", attributes: { name: "phone" } }
              ]
            },
            { type: "button", attributes: { type: "submit" } }
          ];
          block.attributes.content.components = formComponent;
        }
        return block;
      });
      blockManager.render(blocks);

      // var _self = this;

      /** editor block */
      editor.BlockManager.add("1colrow", {
        name: "1colrow",
        label: "Full width",
        media: '<img src="buildericons/column.svg"/>',
        category: "Basic",
        style: { order: "1" },
        content: {
          type: "default",
          name: "content wrap",
          attributes: { class: "onecol-wrap" },
          styles:
            ".onecol-wrap {display:flex;padding:20px 20px; max-width:auto;width:100%;} .content-headline {font-family:Inter, sans-serif; font-size:20px;width:100%;font-weight:600;margin-bottom:10px;} .content-post {font-family:Inter, sans-serif; width:100%;} .onecol-inner {display:flex;padding:40px 40px; max-width:1200px;width:100%;flex-direction:column;margin:0 auto;}",
          components: [
            {
              type: "default",
              name: "Content",
              attributes: { class: "onecol-inner" },
              styles: "",
              droppable: true,
              editable: true,
              components: [
                {
                  name: "headline",
                  type: "text",
                  tagname: "h1",
                  content: "Your cool feature here",
                  attributes: { class: "content-headline" },
                  styles: ""
                },

                {
                  name: "text",
                  type: "text",
                  tagname: "p",
                  content:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus laoreet odio ac tristique. Nunc nisl tellus, porta eget eros at, rutrum tempor magna. Etiam ut elementum velit. Morbi auctor elit vel lacinia accumsan.",
                  attributes: { class: "content-post" },
                  styles: ""
                }
              ]
            }
          ]
        }
      });

      editor.BlockManager.add("2colrow", {
        name: "2colrow",
        label: "2 Columns",
        media: '<img src="buildericons/2colrow.svg"/>',
        category: "Basic",
        style: { order: "2" },
        content: {
          type: "default",
          name: "content wrap",
          attributes: { class: "twocol-wrap" },
          styles: ".twocol-wrap {display:flex;padding:20px 20px; min-height:100px;max-width:auto;width:100%;}",
          components: [
            {
              type: "default",
              name: "content",
              attributes: { class: "twocol-inner" },
              styles:
                ".twocol-inner {display:flex;padding:20px 20px; min-height:100px;max-width:1200px;width:100%;margin:0 auto;} @media screen and (max-width: 990px)  { .twocol-inner { flex-direction:column;}}",
              droppable: true,
              editable: true,
              components: [
                {
                  type: "default",
                  droppable: true,
                  editable: true,
                  name: "col1",
                  attributes: { class: "twocol-column" },
                  styles:
                    ".twocol-column {font-family: Inter, sans-serif; padding:20px 20px; display:flex; flex-direction:column;cursor:arrow;width:50%;float:left;} @media screen and (max-width: 990px)  { .twocol-column { width:100%;}}",
                  components: [
                    {
                      name: "image",
                      type: "image",
                      attributes: {
                        src: "https://app.convertlead.com/buildericons/imgplaceholder.svg",
                        class: "content-image"
                      },
                      styles: ".content-image {width:100%;display:block;margin-bottom:20px}"
                    },
                    {
                      name: "headline",
                      type: "text",
                      tagname: "h1",
                      content: "Your cool feature here",
                      attributes: { class: "content-headline" },
                      styles:
                        ".content-headline {font-family:Inter, sans-serif; font-size:20px; font-weight:600; margin-bottom:10px;}"
                    },
                    {
                      name: "text",
                      type: "text",
                      tagname: "p",
                      content:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus laoreet odio ac tristique. Nunc nisl tellus, porta eget eros at, rutrum tempor magna. Etiam ut elementum velit. Morbi auctor elit vel lacinia accumsan.",
                      attributes: { class: "content-article" },
                      styles: ".content-article {font-family:Inter, sans-serif;}"
                    }
                  ]
                },

                {
                  type: "default",
                  droppable: true,
                  editable: true,
                  name: "col2",
                  attributes: { class: "twocol-column" },
                  styles:
                    ".twocol-column {font-family: Inter, sans-serif; padding:20px 20px; display:flex; flex-direction:column;cursor:arrow;width:50%;float:left;} @media screen and (max-width: 990px)  { .twocol-column { width:100%;}}",
                  components: [
                    {
                      name: "image",
                      type: "image",
                      attributes: {
                        src: "https://app.convertlead.com/buildericons/imgplaceholder.svg",
                        class: "content-image"
                      },
                      styles: ".content-image {width:100%;display:block;margin-bottom:20px}"
                    },

                    {
                      name: "headline",
                      type: "text",
                      tagname: "h1",
                      content: "Your cool feature here",
                      attributes: { class: "content-headline" },
                      styles:
                        ".content-headline {font-family:Inter, sans-serif; font-size:20px; font-weight:600; margin-bottom:10px;}"
                    },

                    {
                      name: "text",
                      type: "text",
                      tagname: "p",
                      content:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus laoreet odio ac tristique. Nunc nisl tellus, porta eget eros at, rutrum tempor magna. Etiam ut elementum velit. Morbi auctor elit vel lacinia accumsan.",
                      attributes: { class: "content-article" },
                      styles: ".content-article {font-family:Inter, sans-serif;}"
                    }
                  ]
                }
              ]
            }
          ]
        }
      });

      editor.BlockManager.add("3colrow", {
        name: "3colrow",
        label: "3 Columns",
        media: '<img src="buildericons/3columns.svg"/>',
        category: "Basic",
        style: { order: "2" },
        content: {
          type: "default",
          name: "content wrap",
          attributes: { class: "threecol-wrap" },
          styles: ".threecol-wrap {display:flex;padding:20px 20px; min-height:100px;max-width:100%;width:100%;}",

          components: [
            {
              type: "default",
              name: "content",
              attributes: { class: "threecol-inner" },
              styles:
                ".threecol-inner {display:flex;padding:20px 20px; min-height:100px;max-width:1200px;width:100%;margin:0 auto;} @media screen and (max-width: 990px)  { .threecol-inner { flex-direction:column;}}",
              droppable: true,
              editable: true,
              components: [
                {
                  type: "default",
                  droppable: true,
                  editable: true,
                  name: "col1",
                  attributes: { class: "threecol-column" },
                  styles:
                    ".threecol-column {font-family: Inter, sans-serif; padding:20px 20px; display:flex; flex-direction:column;cursor:arrow;width:33%;float:left;} @media screen and (max-width: 990px)  { .threecol-column { width:100%;}}",
                  components: [
                    {
                      name: "image",
                      type: "image",
                      attributes: {
                        src: "https://app.convertlead.com/buildericons/imgplaceholder.svg",
                        class: "content-image"
                      },
                      styles: ".content-image {width:100%; display:block;margin-bottom:20px}"
                    },

                    {
                      name: "headline",
                      type: "text",
                      tagname: "h1",
                      content: "Your cool feature here",
                      attributes: { class: "content-headline" },
                      styles:
                        ".content-headline {font-family:Inter, sans-serif; font-size:20px; font-weight:600; margin-bottom:10px;}"
                    },

                    {
                      name: "text",
                      type: "text",
                      tagname: "p",
                      content:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus laoreet odio ac tristique. Nunc nisl tellus, porta eget eros at, rutrum tempor magna. Etiam ut elementum velit. Morbi auctor elit vel lacinia accumsan.",
                      attributes: { class: "content-article" },
                      styles: ".content-article {font-family:Inter, sans-serif;}"
                    }
                  ]
                },
                {
                  type: "default",
                  droppable: true,
                  editable: true,
                  name: "col1",
                  attributes: { class: "threecol-column" },
                  styles:
                    ".threecol-column {font-family: Inter, sans-serif; padding:20px 20px; display:flex; flex-direction:column;cursor:arrow;width:33%;float:left;} @media screen and (max-width: 990px)  { .threecol-column { width:100%;}}",
                  components: [
                    {
                      name: "image",
                      type: "image",
                      attributes: {
                        src: "https://app.convertlead.com/buildericons/imgplaceholder.svg",
                        class: "content-image"
                      },
                      styles: ".content-image {width:100%; display:block;margin-bottom:20px}"
                    },

                    {
                      name: "headline",
                      type: "text",
                      tagname: "h1",
                      content: "Your cool feature here",
                      attributes: { class: "content-headline" },
                      styles:
                        ".content-headline {font-family:Inter, sans-serif; font-size:20px; font-weight:600; margin-bottom:10px;}"
                    },

                    {
                      name: "text",
                      type: "text",
                      tagname: "p",
                      content:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus laoreet odio ac tristique. Nunc nisl tellus, porta eget eros at, rutrum tempor magna. Etiam ut elementum velit. Morbi auctor elit vel lacinia accumsan.",
                      attributes: { class: "content-article" },
                      styles: ".content-article {font-family:Inter, sans-serif;}"
                    }
                  ]
                },

                {
                  type: "default",
                  droppable: true,
                  editable: true,
                  name: "col2",
                  attributes: { class: "threecol-column" },
                  styles:
                    ".threecol-column {font-family: Inter, sans-serif; padding:20px 20px; display:flex; flex-direction:column;cursor:arrow;width:33%;float:left;} @media screen and (max-width: 990px)  { .threecol-column { width:100%;}}",
                  components: [
                    {
                      name: "image",
                      type: "image",
                      attributes: {
                        src: "https://app.convertlead.com/buildericons/imgplaceholder.svg",
                        class: "content-image"
                      },
                      styles: ".content-image {width:100%;display:block;margin-bottom:20px}"
                    },
                    {
                      name: "headline",
                      type: "text",
                      tagname: "h1",
                      content: "Your cool feature here",
                      attributes: { class: "content-headline" },
                      styles:
                        ".content-headline {font-family:Inter, sans-serif; font-size:20px; font-weight:600; margin-bottom:10px;}"
                    },
                    {
                      name: "text",
                      type: "text",
                      tagname: "p",
                      content:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus laoreet odio ac tristique. Nunc nisl tellus, porta eget eros at, rutrum tempor magna. Etiam ut elementum velit. Morbi auctor elit vel lacinia accumsan.",
                      attributes: { class: "content-article" },
                      styles: ".content-article {font-family:Inter, sans-serif;}"
                    }
                  ]
                }
              ]
            }
          ]
        }
      });

      editor.BlockManager.add("37colrow", {
        name: "37colrow",
        label: "2 Columns 3/7",
        media: '<img src="buildericons/2col37.svg"/>',
        category: "Basic",
        style: { order: "2" },
        content: {
          type: "default",
          name: "content wrap",
          attributes: { class: "threeseven-wrap" },
          styles:
            ".threeseven-wrap {display:flex;padding:20px 20px; min-height:100px;max-width:100%;width:100%;}",
          components: [
            {
              type: "default",
              name: "content",
              attributes: { class: "threeseven-inner" },
              styles:
                ".threeseven-inner {display:flex;padding:20px 20px; min-height:100px;max-width:1200px;width:100%;margin:0 auto;} @media screen and (max-width: 990px)  { .threeseven-inner { flex-direction:column;}}",
              droppable: true,
              editable: true,
              components: [
                {
                  type: "default",
                  droppable: true,
                  editable: true,
                  name: "col1",
                  attributes: { class: "threeseven-column" },
                  styles:
                    ".threeseven-column {font-family: Inter, sans-serif; padding:20px 20px; display:flex; flex-direction:column;cursor:arrow;width:30%;float:left;} @media screen and (max-width: 990px)  { .threeseven-column { width:100%;}}",
                  components: [
                    {
                      name: "image",
                      type: "image",
                      attributes: {
                        src: "https://app.convertlead.com/buildericons/imgplaceholder.svg",
                        class: "threeseven-image"
                      },
                      styles: ".threeseve-image {width:100%; display:block;}"
                    }
                  ]
                },
                {
                  type: "default",
                  droppable: true,
                  editable: true,
                  name: "col2",
                  attributes: { class: "threesevenright-column" },
                  styles:
                    ".threesevenright-column {font-family: Inter, sans-serif; padding:20px 20px; display:flex; flex-direction:column;cursor:arrow;width:70%;float:left;} @media screen and (max-width: 990px)  { .threesevenright-column { width:100%;}}",
                  components: [
                    {
                      name: "headline",
                      type: "text",
                      tagname: "h1",
                      content: "Your cool feature here",
                      attributes: { class: "content-headline" },
                      styles:
                        ".content-headline {font-family:Inter, sans-serif; font-size:20px; font-weight:600; margin-bottom:10px;}"
                    },
                    {
                      name: "text",
                      type: "text",
                      tagname: "p",
                      content:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus laoreet odio ac tristique. Nunc nisl tellus, porta eget eros at, rutrum tempor magna. Etiam ut elementum velit. Morbi auctor elit vel lacinia accumsan.",
                      attributes: { class: "content-article" },
                      styles: ".content-article {font-family:Inter, sans-serif;}"
                    },
                    {
                      name: "text",
                      type: "text",
                      tagname: "p",
                      content:
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus laoreet odio ac tristique. Nunc nisl tellus, porta eget eros at, rutrum tempor magna. Etiam ut elementum velit. Morbi auctor elit vel lacinia accumsan.",
                      attributes: { class: "content-article-bottom" },
                      styles:
                        ".content-article-bottom {font-family:Inter, sans-serif; margin-top:20px}"
                    }
                  ]
                }
              ]
            }
          ]
        }
      });

      editor.BlockManager.add("navbar2", {
        name: "navbar2",
        label: "Menu bar",
        media: '<img src="buildericons/navbar.svg"/>',
        category: "Content",
        style: { order: "2" },
        content: {
          type: "default",
          name: "navbar wrap",
          attributes: { class: "navbar-wrap" },
          styles:
            ".navbar-wrap {display:flex;padding:10px; max-width:100%;width:100%; background-color:#4a4967;}",
          components: [
            {
              type: "default",
              name: "navbar",
              attributes: { class: "navbar-container" },
              styles:
                ".navbar-container { height:70px; display:flex; max-width:1200px; width:100%; margin:0 auto; padding:0 40px; position:relative; flex-wrap:wrap} ",
              droppable: true,
              editable: true,
              components: [
                {
                  name: "logo-link",
                  type: "link",
                  attributes: { href: "https://google.com", class: "navbar-logo-link" },
                  styles:
                    ".navbar-logo-link {width:20%;display:flex;margin:0px;padding:5px;justify-content:flex-start;align-content:center;align-items:center;}",

                  components: [
                    {
                      name: "logo image",
                      type: "image",
                      attributes: {
                        src: "https://app.convertlead.com/buildericons/logoplaceholder.svg",
                        class: "logo-img"
                      },
                      styles: ".logo-img {width:auto; height:100%; z-index:1;}"
                    }
                  ]
                },
                {
                  type: "checkbox",
                  name: "toggle-menu",
                  attributes: { id: "menu-toggle" },
                  styles:
                    "#menu-toggle { display:none; cursor:pointer;opacity:0;width:40px;height:40px;position:absolute;right:30px;top:0; } @media screen and (max-width: 990px)  { #menu-toggle {height:100%;}}",
                  selectable: false,
                  hoverable: false,
                  editable: false
                },
                {
                  type: "default",
                  droppable: true,
                  editable: true,
                  name: "navmenu-inner",
                  attributes: { class: "navmenu-inner" },
                  styles:
                    " .navmenu-inner { align-content: flex-end; justify-content: flex-end; align-items: center; padding:0px; display:flex; flex-direction:row; flex-basis:80%;width:80% ;} @media screen and (max-width: 990px) { .navmenu-inner{ display:none; padding-top:35px;} #menu-toggle:checked ~ .navmenu-inner { display:flex !important;   width: 100% !important; order: 3 !important; flex-basis: 100%; flex-direction: column !important; z-index:6} }",

                  components: [
                    {
                      name: "menu-button",
                      type: "link",
                      styles:
                        ".navmenu-but { justify-content: center; min-height:auto; flex-direction: column; align-items: center; height:100%;display:flex; color:#ffffff; font-weight:600; margin-right:10px;padding:10px;font-family:Inter, sans-serif;text-decoration:none;} @media screen and (max-width: 990px)  { .navmenu-but {width:100%;align-items:flex-start; padding-left:30px;}",
                      attributes: { href: "https://google.com", class: "navmenu-but" },
                      content: "Home"
                    },

                    {
                      name: "menu-button",
                      type: "link",
                      attributes: { href: "https://google.com", class: "navmenu-but" },
                      content: "Contact"
                    },

                    {
                      name: "menu-button",
                      type: "link",
                      attributes: { href: "https://google.com", class: "navmenu-but" },
                      content: "About Us"
                    }
                  ]
                },
                {
                  type: "label",
                  name: "burger-but",
                  attributes: { class: "burger-but", for: "menu-toggle" },
                  styles:
                    ".burger-line {transition: all 0.5s ease-out; width:33px; height:4px; display:block;background-color:#fff;margin-bottom:5px;border-radius:3px;z-index:1;cursor:pointer;} .burger-but { width:auto; margin-bottom:0px; display: none ; margin-right:20px; flex-direction: column; justify-content:center; align-content center; align-items:center; cursor:pointer; width:auto; margin-left:auto; padding-top:5px;} @media screen and (max-width: 990px)  { .burger-but { display:flex; position: relative; } .burger-but .burger-line {transition: all 0.1s ease-in;} #menu-toggle:checked ~ .burger-but .burger-line {position:absolute; transition: all 0.1s ease-in; right: 0px;} #menu-toggle:checked ~ .burger-but .burger-line:nth-child(1) {transform: rotate(45deg); transition: all 0.1s ease-in; transition: all 0.1s ease-in;} #menu-toggle:checked ~ .burger-but .burger-line:nth-child(3) {transform: rotate(-45deg); transition: all 0.1s ease-in; } #menu-toggle:checked ~ .burger-but .burger-line:nth-child(2){ opacity:0 !important; position:relative; height:100%; transition: all 0.1s ease-in;}  } ",

                  components: [
                    {
                      name: "burger-line",
                      type: "default",
                      tagname: "span",
                      attributes: { class: "burger-line" }
                    },

                    {
                      name: "burger-line",
                      type: "default",
                      tagname: "span",
                      attributes: { class: "burger-line" }
                    },

                    {
                      name: "burger-line",
                      type: "default",
                      tagname: "span",
                      attributes: { class: "burger-line" }
                    }
                  ]
                }
              ]
            }
          ]
        }
      });

      editor.DomComponents.addType("label", {
        model: {
          defaults: {
            enableEvents: true,
            attributes: { class: "label-basic" },
            styles:
              ".label-basic {color:#3c3a4e; width:100%; padding:5px 10px;font-family:Inter, sans-serif;font-weight:700;font-size:15px;margin-bottom:5px;}"
          }
        }
      });

      editor.BlockManager.add("countdowntimer", {
        name: "Countdown",
        label: "Countdown",
        media: '<img src="buildericons/countdown.svg"/>',
        category: "Content",
        style: { order: "5" },
        content: {
          type: "countdown",
          attributes: { class: "countdown-wrap" },
          name: "Countdown",
          styles:
            ".countdown-wrap, .countdown {align-content: center;justify-content: center;align-items: center;display: flex; padding:20px; } .countdown-cont {justify-content: center;align-items: center;align-content: center;width: auto; display: inline-block;} .countdown-digit {font-family:Lato, sans-serif;  font-size: 3rem; font-weight:600;} .countdown-label {font-family: Lato, sans-serif; font-size: 15px;} .countdown-block {background-color:#616688; padding:10px; border-radius: 10px 10px 10px 10px;; overflow:hidden; box-shadow: 0px 4px 2px 0px rgba(72,72,72,0.25);color: #ffffff; margin: 5px;display: inline-block; text-align: center;}"
        }
      });

      editor.BlockManager.add("tabs-block", {
        name: "tabs block",
        label: "Tabs block",
        media: '<img src="buildericons/tabs.svg"/>',
        category: "Content",
        style: { order: "8" },
        content: {
          type: "tabs",
          name: "tabs-wrapper",
          attributes: { class: "tabs-wrap" },
          styles:
            ".tabs-wrap {padding:25px; display:flex; flex-direction:column} .tab-contents { display:flex; overflow:hidden; border-radius: 0px 5px 5px 5px; max-width:100%; background-color:#ffffff; color:#333333; font-family:Inter, sans-serif; padding:25px} .tab-container {display:flex; overflow:hidden; border-radius: 5px 5px 0px 0px; align-self:flex-start; text-align:left;padding:0px;margin:0px; width:auto; flex-direction:row; justify-content:flex-start; align-items:flex-start;} .tab { cursor:pointer; display:flex; padding: 15px 25px;margin: 0; opacity:0.8; color:#fff; font-family:Inter, sans-serif; font-weight:500; background-color: rgb(97, 102, 136); float:left;} .tab-active { opacity:1; font-weight:600}",

          components: [
            {
              name: "tabs-menu",
              type: "tab-container",
              attributes: { class: "tabs-container" },

              components: [
                {
                  name: "tab-button",
                  type: "tab",
                  attributes: { class: "tab" },

                  components: [{ name: "tab-button", type: "text", content: "First tab" }]
                },

                {
                  name: "tab-button",
                  type: "tab",
                  attributes: { class: "tab" },

                  components: [{ name: "tab-button", type: "text", content: "Second tab" }]
                },

                {
                  name: "tab-button",
                  type: "tab",
                  attributes: { class: "tab" },

                  components: [{ name: "tab-button", type: "text", content: "Third tab" }]
                }
              ]
            },

            { name: "tab-contents", type: "tab-contents", attributes: { class: "tab-contents" } }
          ]
        }
      });

      editor.BlockManager.add("customcodebox", {
        name: "Customcode",
        label: "Custom HTML",
        media: '<img src="buildericons/customcode.svg"/>',
        category: "Content",
        style: { order: "9" },
        content: {
          type: "custom-code",
          name: "Customcode",
          attributes: { class: "customcode-container" },
          styles:
            ".customcode-container{font-family:Inter, sans-serif; font-size:18px; width:100%; max-width:1200px; padding:25px; font-style: italic;} .customcode-container span {width:100%;display:block; font-style: italic;}"
        }
      });

      editor.BlockManager.add("textblock", {
        name: "Text block",
        label: "Text block",
        media: '<img src="buildericons/text.svg"/>',
        category: "Content",
        style: { order: "1" },
        content: {
          type: "text",
          name: "Text block",
          attributes: { class: "text-container" },
          styles:
            ".text-container {font-family:Inter, sans-serif;font-size:18px; color:#27282d; font-weight:400; width:100%; padding:10px;} ",
          content:
            "Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old."
        }
      });

      editor.BlockManager.add("textsectionblock", {
        name: "Text section",
        label: "Text section",
        media: '<img src="buildericons/textsection.svg"/>',
        category: "Content",
        style: { order: "4" },
        content: {
          type: "text",
          name: "Text Section",
          attributes: { class: "text-sectionblock" },
          styles:
            ".text-sectionblock {font-family:Inter, sans-serif; color:#27282d; display:flex;width: 100%; flex-wrap:wrap; flex-direction:column; justify-content:flex-start;align-items:flex-start;padding:10px;} ",

          components: [
            {
              name: "headline",
              type: "text",
              tagname: "h1",
              content: "Your cool feature here",
              attributes: { class: "section-headline" },
              styles:
                ".section-headline {font-family:Inter, sans-serif; font-size:20px; font-weight:600; margin-bottom:10px;}"
            },

            {
              name: "text",
              type: "text",
              tagname: "p",
              content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus laoreet odio ac tristique. Nunc nisl tellus, porta eget eros at, rutrum tempor magna. Etiam ut elementum velit. Morbi auctor elit vel lacinia accumsan.",
              attributes: { class: "section-article" },
              styles: ".section-article {font-family:Inter, sans-serif; width:100%;}"
            }
          ]
        }
      });

      editor.BlockManager.add("ctabutton", {
        name: "Button",
        label: "Button",
        media: '<img src="buildericons/button.svg"/>',
        category: "Content",
        style: { order: "3" },
        content: {
          type: "link",
          name: "Button",
          attributes: { class: "button-container", href: "http://yourwebsite.com" },
          styles:
            ".button-container {font-family:Inter, sans-serif;font-size:18px;color:#ffffff; font-weight:600; box-shadow: 0px 3px 3px 0px rgba(0,0,0,0.28); display:flex;justify-content:center; text-decoration:none; width: 100%; max-width:300px; margin:15px auto; position: relative;background-color:#7ebd00; padding:25px 35px;border:none;border-radius:7px;} ",

          components: [
            {
              type: "textnode",
              name: "button-text",
              content: "Click me now"
            }
          ]
        }
      });

      editor.BlockManager.add("videoblock", {
        name: "Video block",
        label: "Video",
        media: '<img src="buildericons/video.svg"/>',
        category: "Content",
        style: { order: "4" },
        content: {

          type: 'default',
          attributes: { class: "video-wrapper" },
          droppable: false,
          name: "Video Wrapper",


          components: [

            {
              type: 'default',
              attributes: { class: "video-block" },
              droppable: false,
              removable: false,
              draggable: false,

              components: [

                {
                  type: "video",
                  name: "video container",
                  removable: false,
                  draggable: false,
                  droppable: false,

                  attributes: {
                    class: "video-embed",

                    onclick: "this.play();",
                    poster:
                      "https://img.freepik.com/free-vector/creative-ideas-vector-light-bulb-doodle_53876-136706.jpg",
                    src:
                      "https://cdn.videvo.net/videvo_files/video/premium/video0449/large_watermarked/295%20-%20Animated%20Horizontal%20Brush%20Strokes%20Pack_665_Brush_14_preview.mp4"
                  },
                }],

            }],

          styles:
            '.video-wrapper {   margin:0 auto 0 auto;padding:15px 15px 15px 15px; background-color:#ffffff; border-radius:10px 10px 10px 10px; box-shadow:0 1px 1px 2px rgba(115,99,125,0.47) ; display:block; width: 100%; position:relative; width:100%;max-width: 990px; height:auto;} .video-block {display:block;width: 100%; height:100%; position:relative; padding-bottom: 56.25%; } .video-embed {display:block; position:absolute;  height: 100%;  width:100%; border:none; max-width:auto; margin:0 auto 0 auto; top:0;left:0; }'
        },
      });

      editor.BlockManager.add("imageblock", {
        name: "image",
        label: "Image",
        media: '<img src="buildericons/image.svg"/>',
        category: "Content",
        style: { order: "2" },
        content: {
          type: "image",
          attributes: {
            src: "https://app.convertlead.com/buildericons/imgplaceholder.svg",
            class: "image-block"
          },
          styles:
            ".image-block {width:100%; max-width:300px; display:block;margin-bottom:20px; border-radius:3px;}"
        }
      });

      editor.BlockManager.add("mapblock", {
        name: "image",
        label: "Google map",
        media: '<img src="buildericons/map.svg"/>',
        category: "Content",
        style: { order: "7" },
        content: {
          type: "map",
          attributes: { class: "map-block" },
          styles: ".map-block {display:block;padding:10px; border-radius:3px; overflow:hidden;}"
        }
      });

      editor.DomComponents.addType("button", {
        model: {
          defaults: {
            style: {
              color: "#fff",
              "max-width": "100%",
              padding: "17px 35px",
              margin: "5px 20px",
              "background-color": "#567af8",
              "font-family": "Inter, sans-serif",
              "font-weight": "600",
              border: "0px",
              "border-radius": "5px 5px 5px 5px",
              display: "block",
              "font-size": "17px",
              cursor: "pointer",
              "text-align": "center"
            },

            text: "Sign up now",

            attributes: { type: "button" }
          }
        }
      });

      editor.DomComponents.addType("input", {
        model: {
          defaults: {
            style: {
              color: "#3c3a4e",
              width: "100%",
              padding: "5px 35px",
              "background-color": "#fff",
              "font-family": "Inter, sans-serif",
              "font-weight": "600",
              border: "1px solid #cacde9",
              "border-radius": "5px 5px 5px 5px",
              display: "block",
              "font-size": "17px",
              cursor: "pointer",
              "margin-bottom": "15px"
            }
          }
        }
      });

      editor.DomComponents.addType("form", {
        isComponent: el => el.tagName === "FORM",
        model: {
          init() { },
          defaults: {
            traits: [
              {
                type: "checkbox",
                name: "integration",
                label: "Send to integration"
              }
            ]
            // attributes: { type: 'text', required: true },
          }
        },
        view: {
          init() {
            this.listenTo(this.model, "change:attributes:integration", this.changeIntegration);
            this.listenTo(this.model, "change:attributes:campaign", this.changeCampaign);
            this.listenTo(this.model, "change:attributes:redirect_checkbox", this.changeRedirect);
            this.listenTo(this.model, "change:attributes:redirect_to", this.changeRedirectUrl);

            if (editor.getHtml().includes("redirect_url_id")) {
              this.model.attributes.attributes.redirect_checkbox = true;
            } else {
              this.model.attributes.attributes.redirect_checkbox = false;
            }
          },
          changeIntegration() {
            // this.model.setAttributes({...this.model.attributes,method:'post'});
            this.model.attributes.attributes.method = "post";
            this.changeTrait();
            const properties = this.model.attributes.attributes;
            if (properties.integration) {
              _self.props.getCompanyDeals();
              if (properties.campaign) {
                let companyId = properties.campaign.split("_")[0];
                let dealId = properties.campaign.split("_")[1];
                _self.props.loadDealCampaigns(companyId, dealId);
              }
            }
          },
          changeCampaign() {
            const component = this.model;
            const campaign = component.getTrait("campaign");
            let companyId = campaign.attributes.value.split("_")[0];
            let dealId = campaign.attributes.value.split("_")[1];
            _self.props.loadDealCampaigns(companyId, dealId);
          },
          changeRedirect() {
            const component = this.model;
            const properties = this.model.attributes.attributes;
            if (properties.redirect_checkbox) {
              component.addTrait(
                {
                  type: "input",
                  name: "redirect_to",
                  label: "redirect to"
                },
                { at: 5 }
              );

              const redirect_url = component
                .get("traits")
                .where({ name: "redirect_to" })[0]
                .get("value");
              component.append(
                "<input id='redirect_url_id' type='hidden' name='redirect_to' value='" +
                redirect_url +
                "'></input>"
              );
            } else {
              component.removeTrait("redirect_to");
              const urlinput = editor.DomComponents.getWrapper().find("#redirect_url_id")[0];
              if (urlinput !== undefined) {
                const coll = urlinput.collection;
                coll.remove(urlinput);
              }
            }
          },
          changeRedirectUrl() {
            const component = this.model;
            const urlinput = editor.DomComponents.getWrapper().find("#redirect_url_id")[0];
            if (urlinput !== undefined) {
              const coll = urlinput.collection;
              coll.remove(urlinput);
            }
            const redirect_url = component
              .get("traits")
              .where({ name: "redirect_to" })[0]
              .get("value");
            component.append(
              "<input id='redirect_url_id' type='hidden' name='redirect_to' value='" +
              redirect_url +
              "'></input>"
            );
          },
          changeTrait() {
            const component = this.model;
            const properties = component.attributes.attributes;

            if (properties.integration === true) {
              //when integration
              component.removeTrait("method");
              component.removeTrait("action");
              component.removeTrait("redirect_to");

              component.addTrait(
                {
                  //campaign
                  type: "select",
                  name: "campaign",
                  label: "Select campaign-----"
                },
                { at: 1 }
              );
              component.addTrait(
                {
                  //integration
                  type: "text",
                  name: "method",
                  label: "Method",
                  attributes: { style: "display:none" }
                },
                { at: 2 }
              );
              component.addTrait(
                {
                  //integration
                  type: "select",
                  name: "action",
                  label: "Select Integration"
                },
                { at: 3 }
              );
              component.addTrait(
                {
                  //redirect checkbox
                  type: "checkbox",
                  name: "redirect_checkbox",
                  label: "redirect on submission"
                },
                { at: 4 }
              );
              if (properties.redirect_checkbox) {
                //when redirect
                component.addTrait(
                  {
                    type: "input",
                    name: "redirect_to",
                    label: "redirect to"
                  },
                  { at: 5 }
                );
              }
            } else {
              //common form method
              component.removeTrait("method");
              component.removeTrait("action");
              component.removeTrait("campaign");
              component.removeTrait("redirect_checkbox");
              component.removeTrait("redirect_to");

              component.addTrait(
                {
                  //method
                  type: "select",
                  label: "Method",
                  name: "method",
                  options: [
                    { value: "get", name: "GET" },
                    { value: "post", name: "POST" }
                  ]
                },
                { at: 1 }
              );
              component.addTrait(
                {
                  //action
                  type: "text",
                  id: "action",
                  name: "action",
                  label: "Action"
                },
                { at: 2 }
              );
            }
          },
          onRender() { }
        }
      });

      const undoManager = editor.UndoManager
      undoManager.start();

      editor.on('run:preview', () => {
        setZIndex(1);
      });

      editor.on('stop:preview', () => {
        setZIndex(4);
      });

      editor.on('component:selected', async (model) => {
        if (model.attributes.type == "form") {
          if (model.attributes.type == "form") {
            const component = editor.getSelected(); //Form component
            const properties = model.attributes.attributes;

            component.removeTrait('action');
            component.removeTrait('method');
            component.removeTrait('campaign');
            component.removeTrait('redirect_checkbox');
            component.removeTrait('redirect_to');

            if (properties.integration == true) {//when integration
              component.addTrait({//campaign
                type: 'select',
                name: 'campaign',
                label: 'Select campaign',
              }, { at: 1 });
              component.addTrait({//method
                type: 'text',
                name: 'method',
                label: 'Method',
                attributes: { style: 'display:none' }
              }, { at: 2 });
              component.addTrait({//integration
                type: 'select',
                name: 'action',
                label: 'Select Integration',
              }, { at: 3 });
              component.addTrait({//redirect checkbox
                type: 'checkbox',
                name: 'redirect_checkbox',
                label: 'redirect on submission',
              }, { at: 4 });
              if (properties.redirect_checkbox) {//when redirect
                component.addTrait({
                  type: 'input',
                  name: 'redirect_to',
                  label: 'redirect to',
                }, { at: 5 });
              }
            } else {//common form method
              component.addTrait({//method
                type: 'select',
                label: 'Method',
                name: 'method',
                options: [
                  { value: 'get', name: 'GET' },
                  { value: 'post', name: 'POST' },
                ]
              }, { at: 1 });
              component.addTrait({//action
                type: 'text',
                id: 'action',
                name: 'action',
                label: 'Action',
              }, { at: 2 });
            }

            if (properties.integration) {
              _self.props.getCompanyDeals();
              if (properties.campaign) {
                let companyId = properties.campaign.split('_')[0];
                let dealId = properties.campaign.split('_')[1];
                console.log(properties.integration);
                _self.props.loadDealCampaigns(companyId, dealId);
              }
            }
          }
        }
      });

      editor.load();

      editorRef.current = editor;
      setEditor(editor);

    } else{
      localStorage.setItem("gjsProject", JSON.stringify(defaultPage));
      setpageContent(true);
    }
  }, [pageContent]);

  useEffect(() => {
  }, []);


  function undo() {
    const undoManager = editor.UndoManager
    if (undoManager.hasUndo()) {
      undoManager.undo();
    }
  }

  function redo() {
    const undoManager = editor.UndoManager
    if (undoManager.hasRedo()) {
      undoManager.redo();
    }
  }

  return (
    <>
      <div id="gjs">
      </div>
    </>
  );
}

export default Builder;