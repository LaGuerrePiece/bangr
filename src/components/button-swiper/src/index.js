/**
 * react-native-swiper
 * @author leecade<leecade@163.com>
 */
import React, { Component } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Modal,
  useColorScheme,
  Appearance,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { color, Easing } from "react-native-reanimated";
import useModalStore from "../../../state/modal";

/**
 * Default styles
 * @type {StyleSheetPropType}
 */

const styles = {
  container: {
    backgroundColor: "transparent",
    position: "relative",
    flex: 1,
  },

  wrapperIOS: {
    backgroundColor: "transparent",
  },

  wrapperAndroid: {
    backgroundColor: "transparent",
    flex: 1,
  },

  slide: {
    backgroundColor: "transparent",
  },

  pagination_x: {
    position: "absolute",
    bottom: 25,
    left: 0,
    right: 0,
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  pagination_y: {
    position: "absolute",
    right: 15,
    top: 0,
    bottom: 0,
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },

  title: {
    height: 30,
    justifyContent: "center",
    position: "absolute",
    paddingLeft: 10,
    bottom: -30,
    left: 0,
    flexWrap: "nowrap",
    width: 250,
    backgroundColor: "transparent",
  },

  buttonWrapper: {
    backgroundColor: "transparent",
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonText: {
    fontSize: 50,
    color: "#007aff",
  },
};

// missing `module.exports = exports['default'];` with babel6
// export default React.createClass({
export default class extends Component {
  /**
   * Props Validation
   * @type {Object}
   */

  static propTypes = {
    horizontal: PropTypes.bool,
    children: PropTypes.node.isRequired,
    containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    scrollViewStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    pagingEnabled: PropTypes.bool,
    showsHorizontalScrollIndicator: PropTypes.bool,
    showsVerticalScrollIndicator: PropTypes.bool,
    bounces: PropTypes.bool,
    scrollsToTop: PropTypes.bool,
    removeClippedSubviews: PropTypes.bool,
    automaticallyAdjustContentInsets: PropTypes.bool,
    showsPagination: PropTypes.bool,
    showsButtons: PropTypes.bool,
    disableNextButton: PropTypes.bool,
    disablePrevButton: PropTypes.bool,
    loadMinimal: PropTypes.bool,
    loadMinimalSize: PropTypes.number,
    loadMinimalLoader: PropTypes.element,
    loop: PropTypes.bool,
    autoplay: PropTypes.bool,
    autoplayTimeout: PropTypes.number,
    autoplayDirection: PropTypes.bool,
    index: PropTypes.number,
    renderPagination: PropTypes.func,
    dotStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    activeDotStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    dotColor: PropTypes.string,
    activeDotColor: PropTypes.string,
    /**
     * Called when the index has changed because the user swiped.
     */
    onIndexChanged: PropTypes.func,
  };

  /**
   * Default props
   * @return {object} props
   * @see http://facebook.github.io/react-native/docs/scrollview.html
   */
  static defaultProps = {
    horizontal: true,
    pagingEnabled: true,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    bounces: false,
    scrollsToTop: false,
    removeClippedSubviews: true,
    automaticallyAdjustContentInsets: false,
    showsPagination: true,
    showsButtons: false,
    disableNextButton: false,
    disablePrevButton: false,
    loop: true,
    loadMinimal: false,
    loadMinimalSize: 1,
    autoplay: false,
    autoplayTimeout: 2.5,
    autoplayDirection: true,
    index: 0,

    onIndexChanged: () => null,
  };

  /**
   * Init states
   * @return {object} states
   */
  state = this.initState(this.props);

  /**
   * Initial render flag
   * @type {bool}
   */
  initialRender = true;

  /**
   * autoplay timer
   * @type {null}
   */
  autoplayTimer = null;
  loopJumpTimer = null;

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!nextProps.autoplay && this.autoplayTimer)
      clearTimeout(this.autoplayTimer);
    if (nextProps.index === this.props.index) return;
    this.setState(
      this.initState(nextProps, this.props.index !== nextProps.index)
    );
  }

  componentDidMount() {
    this.autoplay();
  }

  componentWillUnmount() {
    this.autoplayTimer && clearTimeout(this.autoplayTimer);
    this.loopJumpTimer && clearTimeout(this.loopJumpTimer);
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    // If the index has changed, we notify the parent via the onIndexChanged callback
    if (this.state.index !== nextState.index)
      this.props.onIndexChanged(nextState.index);
  }

  componentDidUpdate(prevProps) {
    // If autoplay props updated to true, autoplay immediately
    if (this.props.autoplay && !prevProps.autoplay) {
      this.autoplay();
    }
    if (this.props.children !== prevProps.children) {
      if (this.props.loadMinimal && Platform.OS === "ios") {
        this.setState({ ...this.props, index: this.state.index });
      } else {
        this.setState(
          this.initState({ ...this.props, index: this.state.index }, true)
        );
      }
    }
  }

  initState(props, updateIndex = false) {
    // set the current state
    const state = this.state || { width: 0, height: 0, offset: { x: 0, y: 0 } };

    const initState = {
      autoplayEnd: false,
      children: null,
      loopJump: false,
      offset: {},
    };

    // Support Optional render page
    initState.children = Array.isArray(props.children)
      ? props.children.filter((child) => child)
      : props.children;

    initState.total = initState.children ? initState.children.length || 1 : 0;

    if (state.total === initState.total && !updateIndex) {
      // retain the index
      initState.index = state.index;
    } else {
      initState.index =
        initState.total > 1 ? Math.min(props.index, initState.total - 1) : 0;
    }

    // Default: horizontal
    const { width, height } = Dimensions.get("window");

    initState.dir = props.horizontal === false ? "y" : "x";

    if (props.width) {
      initState.width = props.width;
    } else if (this.state && this.state.width) {
      initState.width = this.state.width;
    } else {
      initState.width = width;
    }

    if (props.height) {
      initState.height = props.height;
    } else if (this.state && this.state.height) {
      initState.height = this.state.height;
    } else {
      initState.height = height;
    }

    initState.offset[initState.dir] =
      initState.dir === "y" ? height * props.index : width * props.index;

    this.internals = {
      ...this.internals,
      isScrolling: false,
    };
    return initState;
  }

  // include internals with state
  fullState() {
    return Object.assign({}, this.state, this.internals);
  }

  onLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    const offset = (this.internals.offset = {});
    const state = { width, height };

    if (this.state.total > 1) {
      let setup = this.state.index;
      if (this.props.loop) {
        setup++;
      }
      offset[this.state.dir] =
        this.state.dir === "y" ? height * setup : width * setup;
    }

    // only update the offset in state if needed, updating offset while swiping
    // causes some bad jumping / stuttering
    if (!this.state.offset) {
      state.offset = offset;
    }

    // related to https://github.com/leecade/react-native-swiper/issues/570
    // contentOffset is not working in react 0.48.x so we need to use scrollTo
    // to emulate offset.
    if (this.initialRender && this.state.total > 1) {
      this.scrollView.scrollTo({ ...offset, animated: false });
      this.initialRender = false;
    }

    this.setState(state);
  };

  loopJump = () => {
    if (!this.state.loopJump) return;
    const i = this.state.index + (this.props.loop ? 1 : 0);
    const scrollView = this.scrollView;
    this.loopJumpTimer = setTimeout(
      () => {
        if (scrollView.setPageWithoutAnimation) {
          scrollView.setPageWithoutAnimation(i);
        } else {
          if (this.state.index === 0) {
            scrollView.scrollTo(
              this.props.horizontal === false
                ? { x: 0, y: this.state.height, animated: false }
                : { x: this.state.width, y: 0, animated: false }
            );
          } else if (this.state.index === this.state.total - 1) {
            this.props.horizontal === false
              ? this.scrollView.scrollTo({
                  x: 0,
                  y: this.state.height * this.state.total,
                  animated: false,
                })
              : this.scrollView.scrollTo({
                  x: this.state.width * this.state.total,
                  y: 0,
                  animated: false,
                });
          }
        }
      },
      // Important Parameter
      // ViewPager 50ms, ScrollView 300ms
      scrollView.setPageWithoutAnimation ? 50 : 300
    );
  };

  /**
   * Automatic rolling
   */
  autoplay = () => {
    if (
      !Array.isArray(this.state.children) ||
      !this.props.autoplay ||
      this.internals.isScrolling ||
      this.state.autoplayEnd
    )
      return;

    this.autoplayTimer && clearTimeout(this.autoplayTimer);
    this.autoplayTimer = setTimeout(() => {
      if (
        !this.props.loop &&
        (this.props.autoplayDirection
          ? this.state.index === this.state.total - 1
          : this.state.index === 0)
      )
        return this.setState({ autoplayEnd: true });

      this.scrollBy(this.props.autoplayDirection ? 1 : -1);
    }, this.props.autoplayTimeout * 1000);
  };

  /**
   * Scroll begin handle
   * @param  {object} e native event
   */
  onScrollBegin = (e) => {
    // update scroll state
    this.internals.isScrolling = true;
    this.props.onScrollBeginDrag &&
      this.props.onScrollBeginDrag(e, this.fullState(), this);
  };

  /**
   * Scroll end handle
   * @param  {object} e native event
   */
  onScrollEnd = (e) => {
    // update scroll state
    this.internals.isScrolling = false;

    // making our events coming from android compatible to updateIndex logic
    if (!e.nativeEvent.contentOffset) {
      if (this.state.dir === "x") {
        e.nativeEvent.contentOffset = {
          x: e.nativeEvent.position * this.state.width,
        };
      } else {
        e.nativeEvent.contentOffset = {
          y: e.nativeEvent.position * this.state.height,
        };
      }
    }

    this.updateIndex(e.nativeEvent.contentOffset, this.state.dir, () => {
      this.autoplay();
      this.loopJump();
    });
    // if `onMomentumScrollEnd` registered will be called here
    this.props.onMomentumScrollEnd &&
      this.props.onMomentumScrollEnd(e, this.fullState(), this);
  };

  /*
   * Drag end handle
   * @param {object} e native event
   */
  onScrollEndDrag = (e) => {
    const { contentOffset } = e.nativeEvent;
    const { horizontal } = this.props;
    const { children, index } = this.state;
    const { offset } = this.internals;
    const previousOffset = horizontal ? offset.x : offset.y;
    const newOffset = horizontal ? contentOffset.x : contentOffset.y;

    if (
      previousOffset === newOffset &&
      (index === 0 || index === children.length - 1)
    ) {
      this.internals.isScrolling = false;
    }
  };

  /**
   * Update index after scroll
   * @param  {object} offset content offset
   * @param  {string} dir    'x' || 'y'
   */
  updateIndex = (offset, dir, cb) => {
    const state = this.state;
    // Android ScrollView will not scrollTo certain offset when props change
    let index = state.index;
    if (!this.internals.offset)
      // Android not setting this onLayout first? https://github.com/leecade/react-native-swiper/issues/582
      this.internals.offset = {};
    const diff = offset[dir] - this.internals.offset[dir];
    const step = dir === "x" ? state.width : state.height;
    let loopJump = false;

    // Do nothing if offset no change.
    if (!diff) return;

    // Note: if touch very very quickly and continuous,
    // the variation of `index` more than 1.
    // parseInt() ensures it's always an integer
    index = parseInt(index + Math.round(diff / step));

    if (this.props.loop) {
      if (index <= -1) {
        index = state.total - 1;
        offset[dir] = step * state.total;
        loopJump = true;
      } else if (index >= state.total) {
        index = 0;
        offset[dir] = step;
        loopJump = true;
      }
    }

    const newState = {};
    newState.index = index;
    newState.loopJump = loopJump;

    this.internals.offset = offset;

    // only update offset in state if loopJump is true
    if (loopJump) {
      // when swiping to the beginning of a looping set for the third time,
      // the new offset will be the same as the last one set in state.
      // Setting the offset to the same thing will not do anything,
      // so we increment it by 1 then immediately set it to what it should be,
      // after render.
      if (offset[dir] === this.internals.offset[dir]) {
        newState.offset = { x: 0, y: 0 };
        newState.offset[dir] = offset[dir] + 1;
        this.setState(newState, () => {
          this.setState({ offset: offset }, cb);
        });
      } else {
        newState.offset = offset;
        this.setState(newState, cb);
      }
    } else {
      this.setState(newState, cb);
    }
  };

  /**
   * Scroll by index
   * @param  {number} index offset index
   * @param  {bool} animated
   */

  scrollBy = (index, animated = true) => {
    if (this.internals.isScrolling || this.state.total < 2) return;
    const state = this.state;
    const diff = (this.props.loop ? 1 : 0) + index + this.state.index;
    let x = 0;
    let y = 0;
    if (state.dir === "x") x = diff * state.width;
    if (state.dir === "y") y = diff * state.height;

    this.scrollView && this.scrollView.scrollTo({ x, y, animated });

    // update scroll state
    this.internals.isScrolling = true;
    this.setState({
      autoplayEnd: false,
    });

    // trigger onScrollEnd manually in android
    if (!animated || Platform.OS !== "ios") {
      setImmediate(() => {
        this.onScrollEnd({
          nativeEvent: {
            position: diff,
          },
        });
      });
    }
  };

  /**
   * Scroll to index
   * @param  {number} index page
   * @param  {bool} animated
   */

  scrollTo = (index, animated = true) => {
    if (
      this.internals.isScrolling ||
      this.state.total < 2 ||
      index == this.state.index
    )
      return;

    const state = this.state;
    const diff = this.state.index + (index - this.state.index);

    let x = 0;
    let y = 0;
    if (state.dir === "x") x = diff * state.width;
    if (state.dir === "y") y = diff * state.height;

    this.scrollView && this.scrollView.scrollTo({ x, y, animated });

    // update scroll state
    this.internals.isScrolling = true;
    this.setState({
      autoplayEnd: false,
    });

    // trigger onScrollEnd manually in android
    if (!animated || Platform.OS !== "ios") {
      setImmediate(() => {
        this.onScrollEnd({
          nativeEvent: {
            position: diff,
          },
        });
      });
    }
  };

  scrollViewPropOverrides = () => {
    const props = this.props;
    let overrides = {};

    /*
    const scrollResponders = [
      'onMomentumScrollBegin',
      'onTouchStartCapture',
      'onTouchStart',
      'onTouchEnd',
      'onResponderRelease',
    ]
    */

    for (let prop in props) {
      // if(~scrollResponders.indexOf(prop)
      if (
        typeof props[prop] === "function" &&
        prop !== "onMomentumScrollEnd" &&
        prop !== "renderPagination" &&
        prop !== "onScrollBeginDrag"
      ) {
        let originResponder = props[prop];
        overrides[prop] = (e) => originResponder(e, this.fullState(), this);
      }
    }

    return overrides;
  };

  /**
   * Render pagination
   * @return {object} react-dom
   */
  renderPagination = () => {
    console.log("renderPagination");
    // By default, dots only show when `total` >= 2
    if (this.state.total <= 1) return null;

    let dots = [];
    const ActiveDot = this.props.activeDot || (
      <View
        style={[
          {
            backgroundColor: this.props.activeDotColor || "#007aff",
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
          },
          this.props.activeDotStyle,
        ]}
      />
    );
    const Dot = this.props.dot || (
      <View
        style={[
          {
            backgroundColor: this.props.dotColor || "rgba(0,0,0,.2)",
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 3,
            marginRight: 3,
            marginTop: 3,
            marginBottom: 3,
          },
          this.props.dotStyle,
        ]}
      />
    );
    for (let i = 1; i < this.state.total; i++) {
      if (this.state.index === 0 && i === 1) {
        dots.push(React.cloneElement(ActiveDot, { key: i }));
      } else {
        dots.push(
          i === this.state.index
            ? React.cloneElement(ActiveDot, { key: i })
            : React.cloneElement(Dot, { key: i })
        );
      }
    }

    console.log("current page: " + this.state.index);
    // let rotateValueHolder = new Animated.Value(20);
    // const rotateData = rotateValueHolder.interpolate({
    //   inputRange: [0, 1],
    //   outputRange: ['0deg', '360deg'],
    // });

    // rotateData.setValue(20);
    // Animated.timing(rotateValueHolder, {
    //   toValue: 1,
    //   duration: 3000,
    //   easing: Easing.linear,
    //   useNativeDriver: false,
    // }).start()

    let rotateValueHolder = new Animated.Value(0);

    const startImageRotateFunction = () => {
      rotateValueHolder.setValue(0);
      Animated.timing(rotateValueHolder, {
        toValue: 0.5,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start(() => startImageRotateFunction());
    };

    const rotateData = rotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });

    startImageRotateFunction();

    return (
      <View>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible == true}
          onRequestClose={() => {
            console.log("Modal has been closed.");
          }}
        >
          <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPress={() => {
              this.setState({ modalVisible: false });
            }}
          >
            <View className="items-center">
              {/* <Image
              className="h-12 w-12 rotate-180"
            source={require("../../../../assets/mainbtn.png")}></Image> */}
            </View>
            <View className="h-4/7 mt-auto rounded-lg bg-primary-light px-2 pt-4">
              <View className="flex">
                <TouchableOpacity
                  className="rounded-xl bg-primary-light p-1.5 shadow-xl"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    //scrol to invest
                    this.scrollTo(3);
                    this.setState({ modalVisible: false });
                  }}
                >
                  <View className="mx-2 flex-row items-center bg-primary-light px-2 py-1">
                    <Image
                      className="h-12 w-12"
                      source={require("../../../../assets/invest.png")}
                    />
                    <View className="ml-4 flex">
                      <Text className="text-lg font-semibold">Invest</Text>
                      <Text className="text-md ml-auto">
                        Grow your money with DeFi
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="bg-seconday-light flex">
                <TouchableOpacity
                  className="rounded-xl bg-primary-light p-1.5 shadow-xl"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    this.scrollTo(2);
                    this.setState({ modalVisible: false });
                  }}
                >
                  <View className="mx-2 flex-row items-center bg-primary-light px-2 py-1">
                    <Image
                      className="h-12 w-12"
                      source={require("../../../../assets/pochicon.png")}
                    />
                    <View className="ml-4 flex">
                      <Text className="text-lg font-semibold">Wallet</Text>
                      <Text className="text-md ml-auto">View your assets</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View className="flex">
                <TouchableOpacity
                  className="rounded-xl bg-primary-light p-1.5 shadow-xl"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    this.scrollTo(1);
                    this.setState({ modalVisible: false });
                  }}
                >
                  <View className="mx-2 flex-row items-center px-2 py-1">
                    <Image
                      className="h-12 w-12"
                      source={require("../../../../assets/swap.png")}
                    />
                    <View className="ml-4 flex">
                      <Text className="text-lg font-semibold">Swap</Text>
                      <Text className="text-md ml-auto">
                        Exchange tokens in seconds
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="flex">
                <TouchableOpacity
                  className="rounded-xl bg-primary-light p-1.5 shadow-xl"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    this.scrollTo(0);
                    this.setState({ modalVisible: false });
                  }}
                >
                  <View className="mx-2 flex-row items-center px-2 py-1">
                    <Image
                      className="h-12 w-12"
                      source={require("../../../../assets/history.png")}
                    />
                    <View className="ml-4 flex">
                      <Text className="text-lg font-semibold">History</Text>
                      <Text className="text-md ml-auto">
                        Have a look at your past transactions
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View className="flex">
                <TouchableOpacity
                  className="rounded-xl bg-primary-light p-1.5 shadow-xl"
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    this.scrollTo(4);
                    this.setState({ modalVisible: false });
                  }}
                >
                  <View className="mx-2 flex-row items-center px-2 py-1">
                    <Image
                      className="h-12 w-12"
                      source={require("../../../../assets/settings.png")}
                    />
                    <View className="ml-4 flex">
                      <Text className="text-lg font-semibold">Settings</Text>
                      <Text className="text-md ml-auto">
                        Configure your app
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                // border here for button
                className="background-primary-light m-auto mb-5  rounded-2xl border-icon-light px-1 py-2 shadow-xl"
                pointerEvents="none"
                visible={this.state.modalVisible}
                onPressIn={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  this.setState({ modalVisible: false });
                }}
              >
                <Image
                  className="h-12 w-12 rotate-180"
                  source={require("../../../../assets/mainbtn.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        <View className="position-absolute flex items-center">
          <TouchableOpacity
            // border here for button
            // className="mx-36 rounded-2xl border-2 px-1 py-1 shadow-xl"
            className={
              this.state.index == 3
                ? "background-primary-light mx-36 rounded-2xl border-icon-light px-1 py-1 shadow-xl opacity-30"
                : "background-primary-light mx-36 rounded-2xl border-icon-light px-1 py-1 shadow-xl"
            }
            pointerEvents="none"
            visible={this.state.modalVisible}
            onPressIn={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            onPressOut={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (this.state.modalVisible == true) {
                this.setState({ modalVisible: false });
              } else {
                this.setState({ modalVisible: true });
              }
            }}
            style={[
              styles["pagination_" + this.state.dir],
              this.props.paginationStyle,
            ]}
          >
            {this.state.index == 2 ? (
              <Animated.Image
                className="h-12 w-12"
                source={require("../../../../assets/mainbtn.png")}
              ></Animated.Image>
            ) : this.state.index == 1 ? (
              <Animated.Image
                className="h-12 w-12 rotate-12"
                source={require("../../../../assets/mainbtn.png")}
              ></Animated.Image>
            ) : this.state.index == 0 ? (
              <Animated.Image
                className="h-12 w-12 rotate-45"
                source={require("../../../../assets/mainbtn.png")}
              ></Animated.Image>
            ) : this.state.index == 3 ? (
              <Animated.Image
                className="h-12 w-12 -rotate-12"
                source={require("../../../../assets/mainbtn.png")}
              ></Animated.Image>
            ) : this.state.index == 4 ? (
              <Animated.Image
                className="h-12 w-12 -rotate-45"
                source={require("../../../../assets/mainbtn.png")}
              ></Animated.Image>
            ) : null}

            {/* {
              this.state.index == 2 ? rotateValueHolder = new Animated.Value(0) : 
              rotateValueHolder = new Animated.Value(30)

            }
            {/* <Animated.Image
              className="h-12 w-12"
              style={{
                transform: [{rotate: rotateData}],
              }}              source={require("../../../../assets/mainbtn.png")}
            ></Animated.Image> */}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderTitle = () => {
    const child = this.state.children[this.state.index];
    const title = child && child.props && child.props.title;
    return title ? (
      <View style={styles.title}>
        {this.state.children[this.state.index].props.title}
      </View>
    ) : null;
  };

  renderNextButton = () => {
    let button = null;

    if (this.props.loop || this.state.index !== this.state.total - 1) {
      button = this.props.nextButton || (
        <Text style={styles.buttonText}>›</Text>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => button !== null && this.scrollBy(1)}
        disabled={this.props.disableNextButton}
      >
        <View>{button}</View>
      </TouchableOpacity>
    );
  };

  renderPrevButton = () => {
    let button = null;

    if (this.props.loop || this.state.index !== 0) {
      button = this.props.prevButton || (
        <Text style={styles.buttonText}>‹</Text>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => button !== null && this.scrollBy(-1)}
        disabled={this.props.disablePrevButton}
      >
        <View>{button}</View>
      </TouchableOpacity>
    );
  };

  renderButtons = () => {
    return (
      <View
        pointerEvents="box-none"
        style={[
          styles.buttonWrapper,
          {
            width: this.state.width,
            height: this.state.height,
          },
          this.props.buttonWrapperStyle,
        ]}
      >
        {this.renderPrevButton()}
        {this.renderNextButton()}
      </View>
    );
  };

  refScrollView = (view) => {
    this.scrollView = view;
  };

  onPageScrollStateChanged = (state) => {
    switch (state) {
      case "dragging":
        return this.onScrollBegin();

      case "idle":
      case "settling":
        if (this.props.onTouchEnd) this.props.onTouchEnd();
    }
  };

  renderScrollView = (pages) => {
    return (
      <ScrollView
        ref={this.refScrollView}
        {...this.props}
        {...this.scrollViewPropOverrides()}
        contentContainerStyle={[styles.wrapperIOS, this.props.style]}
        contentOffset={this.state.offset}
        onScrollBeginDrag={this.onScrollBegin}
        onMomentumScrollEnd={this.onScrollEnd}
        onScrollEndDrag={this.onScrollEndDrag}
        style={this.props.scrollViewStyle}
      >
        {pages}
      </ScrollView>
    );
  };

  /**
   * Default render
   * @return {object} react-dom
   */
  render() {
    const { index, total, width, height, children } = this.state;
    const {
      containerStyle,
      loop,
      loadMinimal,
      loadMinimalSize,
      loadMinimalLoader,
      renderPagination,
      showsButtons,
      showsPagination,
    } = this.props;
    // let dir = state.dir
    // let key = 0
    const loopVal = loop ? 1 : 0;
    let pages = [];

    const pageStyle = [{ width: width, height: height }, styles.slide];
    const pageStyleLoading = {
      width,
      height,
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    };

    // For make infinite at least total > 1
    if (total > 1) {
      // Re-design a loop model for avoid img flickering
      pages = Object.keys(children);
      if (loop) {
        pages.unshift(total - 1 + "");
        pages.push("0");
      }

      pages = pages.map((page, i) => {
        if (loadMinimal) {
          if (
            (i >= index + loopVal - loadMinimalSize &&
              i <= index + loopVal + loadMinimalSize) ||
            // The real first swiper should be keep
            (loop && i === 1) ||
            // The real last swiper should be keep
            (loop && i === total - 1)
          ) {
            return (
              <View style={pageStyle} key={i}>
                {children[page]}
              </View>
            );
          } else {
            return (
              <View style={pageStyleLoading} key={i}>
                {loadMinimalLoader ? loadMinimalLoader : <ActivityIndicator />}
              </View>
            );
          }
        } else {
          return (
            <View style={pageStyle} key={i}>
              {children[page]}
            </View>
          );
        }
      });
    } else {
      pages = (
        <View style={pageStyle} key={0}>
          {children}
        </View>
      );
    }

    return (
      <View style={[styles.container, containerStyle]} onLayout={this.onLayout}>
        {this.renderScrollView(pages)}
        {showsPagination &&
          (renderPagination
            ? renderPagination(index, total, this)
            : this.renderPagination())}
        {this.renderTitle()}
        {showsButtons && this.renderButtons()}
      </View>
    );
    console.log("render");
    // log current page
    console.log("current page: " + this.state.index);
  }
}
