import React, { Component } from "react";

// Pure function returning the initial state object based on the settings object.
// Te scroller would not have any items in the buffer on initialization; 
// The buffer remains empty until the first get method call returns a non-empty result. 

const setInitialState = settings => {
  const {
    itemHeight,
    amount,
    tolerance,
    minIndex,
    maxIndex,
    startIndex
  } = settings;
  const viewportHeight = amount * itemHeight;
  const totalHeight = (maxIndex - minIndex + 1) * itemHeight;
  const toleranceHeight = tolerance * itemHeight;
  const bufferHeight = viewportHeight + 2 * toleranceHeight;
  const bufferedItems = amount + 2 * tolerance;
  const itemsAbove = startIndex - tolerance - minIndex;
  const topPaddingHeight = itemsAbove * itemHeight;
  const bottomPaddingHeight = totalHeight - topPaddingHeight;
  const initialPosition = topPaddingHeight + toleranceHeight;
  return {
    settings,
    viewportHeight,
    totalHeight,
    toleranceHeight,
    bufferHeight,
    bufferedItems,
    topPaddingHeight,
    bottomPaddingHeight,
    initialPosition,
    data: []
  };
};

class Scroller extends Component {
  // initialization of the state.
  // creation of the viewport element reference.
  // initialize viewport with two padding elements in which cumulative height corresponds to the volume of all the data we are going to show/virtualize. 
  constructor(props) {
    super(props);
    this.state = setInitialState(props.settings);
    this.viewportElement = React.createRef();
  }

  // Setting the viewport scrollbar position to its initial value.
  componentDidMount() {
    this.viewportElement.current.scrollTop = this.state.initialPosition;
    if (!this.state.initialPosition) {
      this.runScroller({ target: { scrollTop: 0 } });
    }
  }

  // The runScroller method will be responsible for fetching data items and adjusting padding elements.
  // It makes some calculations based on the current scroll position passed as an argument.
  runScroller = ({ target: { scrollTop } }) => {
    const {
      totalHeight,
      toleranceHeight,
      bufferedItems,
      settings: { itemHeight, minIndex }
    } = this.state;

    // Taking a new portion of the dataset, which will be a new scroller data items buffer.
    const index =
      minIndex + Math.floor((scrollTop - toleranceHeight) / itemHeight);
    const data = this.props.get(index, bufferedItems);

    // Getting new values for the height of the top and bottom padding elements. 
    const topPaddingHeight = Math.max((index - minIndex) * itemHeight, 0);
    const bottomPaddingHeight = Math.max(
      totalHeight - topPaddingHeight - data.length * itemHeight,
      0
    );

    //Updating the state.
    this.setState({
      topPaddingHeight,
      bottomPaddingHeight,
      data
    });
  };

//Basically three DOM elements need to be rendered 
// 1. A viewport element with constrained height and overflow-y: auto style.
// 2. Two padding elements with no content but with dynamic heights.
// 3. A list of buffered data items wrapped with row templates.

  render() {
    const {
      viewportHeight,
      topPaddingHeight,
      bottomPaddingHeight,
      data
    } = this.state;
    return (
      <div
        className="viewport"
        ref={this.viewportElement}
        onScroll={this.runScroller}
        style={{ height: viewportHeight }}
      >
        <div style={{ height: topPaddingHeight }} />
        {data.map(this.props.row)}
        <div style={{ height: bottomPaddingHeight }} />
      </div>
    );
  }
}

export default Scroller;
