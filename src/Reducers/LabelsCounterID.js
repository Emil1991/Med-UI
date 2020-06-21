
  const LabelsCounterID = (state=1, action) => {
    switch (action.type) {
        case "ADD_LABEL":
            return state+1;
        default:
            return state;
    }

  }
  
  export default LabelsCounterID;