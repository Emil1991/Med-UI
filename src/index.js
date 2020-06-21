import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import './index.scss';
import App from './App';
import rootReducer from './Reducers'
const store = createStore(rootReducer,
  {
    Images:{container: [],currentImage: ""},
    Labels: { container: [], searchQuery: '', dummyNewLabel: true,newCanvasLabel:false ,currentNewLabelID:0,
        currentHover: {tool:"",id:""},currentMouseOut: {tool:"",id:""},canvasLabelCurds:{top:60,left:0}},
    Tools: {
      currentSelector:"classification",
      boundingBox: {
        isSelected: false,
        labels: {}, userLabels: {}, pendingLabels: {}
      },
      polygon: {
        isSelected: false,
        labels: {}, userLabels:{}, pendingLabels:{}
      },
      classification: {
        isSelected: true,
        labels: {},
          userLabels:{},
          pendingLabels:{}
      }
    },
      Toggles:{
          imagesVisible: true,
          labelsVisible: true,
          classificationLabelsIsVisible:true,
          boundingBoxLabelsIsVisible:false,
          polygonLabelsIsVisible:false,
          moveToolIsSelected:false,
          pointerToolIsSelected:true
      },
      Output:{
        currentSelector: "classification",
          container:{}
    }
  }
)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


