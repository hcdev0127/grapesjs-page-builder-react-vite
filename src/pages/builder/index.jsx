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
import './grapes.css';
import './index.scss';

import defaultPage from './default';

const svgNameList = ['column', '2columns', '3columns', '2col37', 'text', 'link', 'image', 'video', 'map', 'linkblock', 'quote', 'textsection', 'form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox', 'radio', 'navbar', 'countdown'
];

const panelList = [];
panelList[0] = [];
panelList[1] = ['ti ti-device-desktop', 'ti ti-device-tablet', 'ti ti-device-mobile'];
panelList[2] = ['ti ti-marquee-2', '', 'ti ti-arrows-maximize', 'ti ti-code', '', '', 'ti ti-file-import', 'ti ti-eraser'];
panelList[3] = ['ti ti-pencil', 'ti ti-settings', 'ti ti-layers-subtract', 'ti ti-layout-grid'];

function Builder() {
  const editorRef = useRef(null);

  const [editor, setEditor] = useState(null);
  const [selPage, setSelPage] = useState(0);
  const [zIndex, setZIndex] = useState(4);
  const [show, setShow] = useState(false);
  const [pindex, setPindex] = useState(0);


  useEffect(() => {
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
    let blocks = blockManager.getAll();

    blocks.map((block, index) => {
      block.attributes.media = '<img src = "buildericons/' + svgNameList[index] + '.svg">';
      blocks[index] = block;
      if (block.attributes.label == "Form") {
        const formComponent = [
          { components: [{ type: 'label', components: 'Name' }, { type: 'input', attributes: { name: 'fullname' } }] },
          { components: [{ type: 'label', components: 'Email' }, { type: 'input', attributes: { type: 'email', name: 'email' } }] },
          { components: [{ type: 'label', components: 'Phone' }, { type: 'input', attributes: { name: 'phone' } }] },
          { type: 'button', attributes: { type: 'submit' } }
        ];
        block.attributes.content.components = formComponent;
      }
    });
    blockManager.render(blocks);

    // var _self = this;

    editor.DomComponents.addType('form', {
      isComponent: el => el.tagName == 'FORM',
      model: {
        init() {
        },
        defaults: {
          traits: [{
            type: 'checkbox',
            name: 'integration',
            label: 'Send to integration',
          }
          ],
          // attributes: { type: 'text', required: true },
        },
      },
      view: {
        init() {
          this.listenTo(this.model, 'change:attributes:integration', this.changeIntegration);
          this.listenTo(this.model, 'change:attributes:campaign', this.changeCampaign);
          this.listenTo(this.model, 'change:attributes:redirect_checkbox', this.changeRedirect);
        },
        changeIntegration() {
          // this.model.setAttributes({...this.model.attributes,method:'post'});
          this.model.attributes.attributes.method = 'post';
          this.changeTrait();
          const properties = this.model.attributes.attributes;
          if (properties.integration) {
            _self.props.getCompanyDeals();
            if (properties.campaign) {
              let companyId = properties.campaign.split('_')[0];
              let dealId = properties.campaign.split('_')[1];
              _self.props.loadDealCampaigns(companyId, dealId);
            }
          }
        },
        changeCampaign() {
          const component = this.model;
          const campaign = component.getTrait('campaign');
          let companyId = campaign.attributes.value.split('_')[0];
          let dealId = campaign.attributes.value.split('_')[1];
          _self.props.loadDealCampaigns(companyId, dealId);
        },
        changeRedirect() {
          const component = this.model;
          const properties = this.model.attributes.attributes;
          if (properties.redirect_checkbox) {
            component.addTrait({
              type: 'input',
              name: 'redirect_to',
              label: 'redirect to',
            }, { at: 5 });
          } else {
            component.removeTrait('redirect_to');
          }
        },
        changeTrait() {
          const component = this.model;
          const properties = component.attributes.attributes;

          if (properties.integration == true) {//when integration
            component.removeTrait('method');
            component.removeTrait('action');
            component.removeTrait('redirect_to');

            component.addTrait({//campaign
              type: 'select',
              name: 'campaign',
              label: 'Select campaign',
            }, { at: 1 });
            component.addTrait({//integration
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
            component.removeTrait('method');
            component.removeTrait('action');
            component.removeTrait('campaign');
            component.removeTrait('redirect_checkbox');
            component.removeTrait('redirect_to');

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
        },
        onRender() {
        }
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
  }, []);

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
      {/* <Button color="grey" className="page_back" style={{ zIndex: zIndex }}><i className='ti ti-arrow-left' /></Button> */}
      <Button.Group className='control page' style={{ zIndex: zIndex }}>
        {/* <Dropdown onChange={(e, data) => this.changePage(e, data)} value={selPage} selection options={pageOptions} className="page_list" /> */}
        {/* <Popup
          trigger={<Button circular icon='ellipsis horizontal' className="page_setting" />}
          content={
            <Button.Group vertical className='page_actions'>
              <Button onClick={() => this.stateChange({ show: true })}>Delete</Button>
              <Button onClick={() => this.duplicate()}>Duplicate</Button>
              <Button onClick={() => this.seo()}>SEO Settings</Button>
            </Button.Group>
          }
          flowing hoverable
          position='bottom center'
        /> */}
        {/* <Button onClick={() => this.add()} color="blue" className="page_add"><i className='ti ti-plus' /></Button> */}
        {/* <Button onClick={() => this.export()} color="blue" className="page_export"><i className='ti ti-download' /></Button> */}

        {/* </Button.Group> */}
        {/* <Button.Group className='control demo' style={{ zIndex: zIndex }}> */}
        {/* <Button onClick={() => this.preview(true)} className="page_preview">Preview</Button> */}
        {/* <Button onClick={() => this.save()} color="blue" className="page_save">Save</Button> */}
      </Button.Group>
      <Icon style={{ zIndex: 5 - zIndex }} name="eye slash" size='big' className="page_preview"></Icon>
      {/* <Button.Group className='control history' style={{ zIndex: zIndex }}> */}
      {/* <Button onClick={() => this.undo()} icon="undo" className="page_undo"></Button> */}
      {/* <Button icon="redo" className="page_redo"></Button> */}
      {/* </Button.Group> */}
      <div id="gjs">
      </div>
    </>
  );
}

export default Builder;