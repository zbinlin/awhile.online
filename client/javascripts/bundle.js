webpackJsonp([0],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _preact = __webpack_require__(1);

	var _preactRouter = __webpack_require__(2);

	var _preactRouter2 = _interopRequireDefault(_preactRouter);

	var _store = __webpack_require__(3);

	var _store2 = _interopRequireDefault(_store);

	__webpack_require__(30);

	var _actions = __webpack_require__(326);

	var actions = _interopRequireWildcard(_actions);

	var _pages = __webpack_require__(333);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	window.addEventListener("shared-session-storage", function (evt) {
	    _store2.default.dispatch(actions.getUserInfo());
	});

	var App = function (_Component) {
	    _inherits(App, _Component);

	    function App() {
	        var _ref;

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        _classCallCheck(this, App);

	        var _this = _possibleConstructorReturn(this, (_ref = App.__proto__ || Object.getPrototypeOf(App)).call.apply(_ref, [this].concat(args)));

	        var store = _this.props.store;

	        _this.state = Object.assign({}, store.getState(), {
	            $dispatch$: function $dispatch$() {
	                return store.dispatch.apply(store, arguments);
	            }
	        });
	        store.subscribe(function () {
	            _this.setState(Object.assign({}, store.getState()));
	        });
	        return _this;
	    }

	    _createClass(App, [{
	        key: "componentDidMount",
	        value: function componentDidMount() {
	            this.props.store.dispatch(actions.getUserInfo());
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var messageContent = this.props.messageContent;

	            var _state = this.state,
	                dispatch = _state.$dispatch$,
	                store = _objectWithoutProperties(_state, ["$dispatch$"]);

	            return (0, _preact.h)(
	                _preactRouter2.default,
	                null,
	                (0, _preact.h)(_pages.Home, { path: "/", dispatch: dispatch, userInfo: store.userInfo }),
	                (0, _preact.h)(_pages.Home, { path: "/index.html", dispatch: dispatch, userInfo: store.userInfo }),
	                (0, _preact.h)(_pages.Publish, { path: "/publish.html", dispatch: dispatch, userInfo: store.userInfo, message: store.message }),
	                (0, _preact.h)(_pages.Login, { path: "/login.html", dispatch: dispatch, userInfo: store.userInfo, auth: store.auth }),
	                (0, _preact.h)(_pages.Register, { path: "/register.html", dispatch: dispatch, userInfo: store.userInfo, register: store.register }),
	                (0, _preact.h)(_pages.Message, _extends({ path: "/m/:id", content: messageContent, dispatch: dispatch }, store, { userInfo: store.userInfo })),
	                (0, _preact.h)(_pages.Message, _extends({ path: "/anonymous/:id", content: messageContent, dispatch: dispatch }, store, { userInfo: store.userInfo }))
	            );
	        }
	    }]);

	    return App;
	}(_preact.Component);

	window.addEventListener("DOMContentLoaded", function () {
	    document.body.innerHTML = "";
	    (0, _preact.render)((0, _preact.h)(App, { store: _store2.default, messageContent: window.messageContent }), document.body);
	}, true);

/***/ },

/***/ 3:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _redux = __webpack_require__(4);

	var _reduxThunk = __webpack_require__(20);

	var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

	var _reducers = __webpack_require__(21);

	var _reducers2 = _interopRequireDefault(_reducers);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = (0, _redux.createStore)(_reducers2.default, (0, _redux.applyMiddleware)(_reduxThunk2.default));

/***/ },

/***/ 21:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _redux = __webpack_require__(4);

	var _auth = __webpack_require__(22);

	var _auth2 = _interopRequireDefault(_auth);

	var _message = __webpack_require__(27);

	var _message2 = _interopRequireDefault(_message);

	var _register = __webpack_require__(28);

	var _register2 = _interopRequireDefault(_register);

	var _userInfo = __webpack_require__(29);

	var _userInfo2 = _interopRequireDefault(_userInfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function debug(fn) {
	    return function () {
	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        console.table(args);
	        return fn.apply(undefined, args);
	    };
	}

	exports.default = debug((0, _redux.combineReducers)({
	    auth: _auth2.default,
	    message: _message2.default,
	    register: _register2.default,
	    userInfo: _userInfo2.default
	}));

/***/ },

/***/ 22:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = auth;

	var _constants = __webpack_require__(23);

	function auth() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var action = arguments[1];

	    switch (action.type) {
	        case _constants.LOGIN_REQUEST:
	            return Object.assign({}, state, {
	                processing: true
	            });
	        case _constants.LOGIN_SUCCESS:
	            return Object.assign({}, state, {
	                success: true,
	                processing: false,
	                error: null
	            });
	        case _constants.LOGIN_FAILURE:
	            return Object.assign({}, state, {
	                success: false,
	                processing: false,
	                error: action.payload
	            });

	        case _constants.RESET_LOGIN:
	            return {};

	        default:
	            return state;
	    }
	}

/***/ },

/***/ 23:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// Error Code

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _errno = __webpack_require__(24);

	Object.keys(_errno).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _errno[key];
	    }
	  });
	});

	var _actions = __webpack_require__(25);

	Object.keys(_actions).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _actions[key];
	    }
	  });
	});

	var _keys = __webpack_require__(26);

	Object.keys(_keys).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _keys[key];
	    }
	  });
	});


	// Action type definition
	var MAX_MESSAGE_CONTENT_LENGTH = exports.MAX_MESSAGE_CONTENT_LENGTH = 1024;

/***/ },

/***/ 24:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var CLIENT_ERROR = exports.CLIENT_ERROR = 256;
	var SERVER_ERROR = exports.SERVER_ERROR = 257;
	var FETCH_ERROR = exports.FETCH_ERROR = 258;
	var FETCH_PARSE_BODY_ERROR = exports.FETCH_PARSE_BODY_ERROR = 259;
	var TIMEOUT_ERROR = exports.TIMEOUT_ERROR = 260;
	var AUTH_ERROR = exports.AUTH_ERROR = 261;
	var LOGIN_ERROR = exports.LOGIN_ERROR = 262;
	var REGISTER_ERROR = exports.REGISTER_ERROR = 263;
	var POST_MESSAGE_ERROR = exports.POST_MESSAGE_ERROR = 264;
	var UNKNOW_ERROR = exports.UNKNOW_ERROR = 65535;

/***/ },

/***/ 25:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	// get user info
	var GET_USER_INFO_REQUEST = exports.GET_USER_INFO_REQUEST = "get user info request";
	var GET_USER_INFO_SUCCESS = exports.GET_USER_INFO_SUCCESS = "get user info success";
	//export const GET_USER_INFO_FAILURE = "get user info failure";

	// post message
	var POST_MESSAGE_REQUEST = exports.POST_MESSAGE_REQUEST = "post message request";
	var POST_MESSAGE_SUCCESS = exports.POST_MESSAGE_SUCCESS = "post message success";
	var POST_MESSAGE_FAILURE = exports.POST_MESSAGE_FAILURE = "post message failure";

	// reset post message state
	var RESET_PUBLISH_STATE = exports.RESET_PUBLISH_STATE = "reset get message ids state";

	// get message ids
	var GET_MESSAGE_IDS_REQUEST = exports.GET_MESSAGE_IDS_REQUEST = "get message ids request";
	var GET_MESSAGE_IDS_SUCCESS = exports.GET_MESSAGE_IDS_SUCCESS = "get message ids success";
	var GET_MESSAGE_IDS_FAILURE = exports.GET_MESSAGE_IDS_FAILURE = "get message ids failure";

	// reset message ids state
	var RESET_MESSAGE_IDS = exports.RESET_MESSAGE_IDS = "reset get message ids state";

	// remove message
	var REMOVE_MESSAGE_REQUEST = exports.REMOVE_MESSAGE_REQUEST = "remove message request";
	var REMOVE_MESSAGE_SUCCESS = exports.REMOVE_MESSAGE_SUCCESS = "remove message success";
	var REMOVE_MESSAGE_FAILURE = exports.REMOVE_MESSAGE_FAILURE = "remove message failure";

	// register user
	var REGISTER_USER_REQUEST = exports.REGISTER_USER_REQUEST = "register user request";
	var REGISTER_USER_SUCCESS = exports.REGISTER_USER_SUCCESS = "register user success";
	var REGISTER_USER_FAILURE = exports.REGISTER_USER_FAILURE = "register user failure";

	// login
	var LOGIN_REQUEST = exports.LOGIN_REQUEST = "login request";
	var LOGIN_SUCCESS = exports.LOGIN_SUCCESS = "login success";
	var LOGIN_FAILURE = exports.LOGIN_FAILURE = "login failure";

	var RESET_LOGIN = exports.RESET_LOGIN = "reset login state";

	// logout
	var LOGOUT_REQUEST = exports.LOGOUT_REQUEST = "logout request";
	var LOGOUT_SUCCESS = exports.LOGOUT_SUCCESS = "logout success";

/***/ },

/***/ 26:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var SESSION_KEY_USER_INFO = exports.SESSION_KEY_USER_INFO = "session.key:user.info";
	var SESSION_KEY_MESSAGE_IDS = exports.SESSION_KEY_MESSAGE_IDS = "session.key:message.ids";
	var KEY_USER_TOKEN = exports.KEY_USER_TOKEN = "key:user.token";

/***/ },

/***/ 27:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = message;

	var _constants = __webpack_require__(23);

	function message() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var action = arguments[1];

	    switch (action.type) {
	        case _constants.POST_MESSAGE_REQUEST:
	            return Object.assign({}, state, {
	                posting: true,
	                link: null,
	                errno: null
	            });
	        case _constants.POST_MESSAGE_SUCCESS:
	            return Object.assign({}, state, {
	                posting: false,
	                link: action.payload
	            });
	        case _constants.POST_MESSAGE_FAILURE:
	            return Object.assign({}, state, {
	                posting: false,
	                error: action.payload
	            });

	        case _constants.RESET_PUBLISH_STATE:
	            return {};

	        default:
	            return state;
	    }
	}

/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = register;

	var _constants = __webpack_require__(23);

	function register() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var action = arguments[1];

	    switch (action.type) {
	        case _constants.REGISTER_USER_REQUEST:
	            return Object.assign({}, state, {
	                processing: true,
	                success: false,
	                error: null
	            });
	        case _constants.REGISTER_USER_SUCCESS:
	            return Object.assign({}, state, {
	                processing: false,
	                success: true
	            });
	        case _constants.REGISTER_USER_FAILURE:
	            return Object.assign({}, state, {
	                processing: false,
	                error: action.payload
	            });

	        default:
	            return state;
	    }
	}

/***/ },

/***/ 29:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = userInfo;

	var _constants = __webpack_require__(23);

	function messageIds() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var action = arguments[1];

	    switch (action.type) {
	        case _constants.GET_MESSAGE_IDS_REQUEST:
	            return Object.assign({}, state, {
	                loading: true,
	                content: null,
	                error: null
	            });
	        case _constants.GET_MESSAGE_IDS_SUCCESS:
	            return Object.assign({}, state, {
	                loading: false,
	                content: action.payload.map(function (id) {
	                    return {
	                        id: id,
	                        deleting: false,
	                        errno: null
	                    };
	                })
	            });
	        case _constants.GET_MESSAGE_IDS_FAILURE:
	            return Object.assign({}, state, {
	                loading: false,
	                error: action.payload
	            });

	        case _constants.REMOVE_MESSAGE_REQUEST:
	            return Object.assign({}, state, {
	                content: state.content.map(function (val) {
	                    if (val.id === action.payload) {
	                        return Object.assign({}, val, {
	                            deleting: true
	                        });
	                    } else {
	                        return val;
	                    }
	                })
	            });
	        case _constants.REMOVE_MESSAGE_FAILURE:
	            return Object.assign({}, state, {
	                content: state.content.map(function (val) {
	                    if (val.id === action.payload.id) {
	                        return Object.assign({}, val, {
	                            deleting: false,
	                            error: action.payload
	                        });
	                    } else {
	                        return val;
	                    }
	                })
	            });

	        default:
	            return state;
	    }
	}

	function userInfo() {
	    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    var action = arguments[1];

	    switch (action.type) {
	        case _constants.GET_USER_INFO_REQUEST:
	            return state;
	        case _constants.GET_USER_INFO_SUCCESS:
	            return Object.assign({}, state, {
	                baseInfo: action.payload
	            });

	        case _constants.RESET_MESSAGE_IDS:
	            return Object.assign({}, state, {
	                messageIds: null
	            });

	        case _constants.GET_MESSAGE_IDS_REQUEST:
	        case _constants.GET_MESSAGE_IDS_SUCCESS:
	        case _constants.GET_MESSAGE_IDS_FAILURE:
	        case _constants.REMOVE_MESSAGE_REQUEST:
	        case _constants.REMOVE_MESSAGE_SUCCESS:
	        case _constants.REMOVE_MESSAGE_FAILURE:
	            return Object.assign({}, state, {
	                messageIds: messageIds(state.messageIds, action)
	            });

	        case _constants.LOGOUT_REQUEST:
	            return state;
	        case _constants.LOGOUT_SUCCESS:
	            return {};

	        default:
	            return state;
	    }
	}

/***/ },

/***/ 326:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _user = __webpack_require__(327);

	Object.keys(_user).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _user[key];
	    }
	  });
	});

/***/ },

/***/ 327:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getUserInfo = getUserInfo;
	exports.postMessage = postMessage;
	exports.resetPublishState = resetPublishState;
	exports.getMessageIds = getMessageIds;
	exports.removeMessage = removeMessage;
	exports.register = register;
	exports.login = login;
	exports.logout = logout;

	var _constants = __webpack_require__(23);

	var _utils = __webpack_require__(328);

	var utils = _interopRequireWildcard(_utils);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

	function getUserInfo(ignoreCache) {
	    var _this = this;

	    return function () {
	        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(dispatch) {
	            var result;
	            return regeneratorRuntime.wrap(function _callee$(_context) {
	                while (1) {
	                    switch (_context.prev = _context.next) {
	                        case 0:
	                            _context.next = 2;
	                            return dispatch({
	                                type: _constants.GET_USER_INFO_REQUEST
	                            });

	                        case 2:
	                            _context.next = 4;
	                            return utils.getUserInfo(ignoreCache);

	                        case 4:
	                            result = _context.sent;
	                            _context.next = 7;
	                            return dispatch({
	                                type: _constants.GET_USER_INFO_SUCCESS,
	                                payload: result
	                            });

	                        case 7:
	                            return _context.abrupt("return", _context.sent);

	                        case 8:
	                        case "end":
	                            return _context.stop();
	                    }
	                }
	            }, _callee, _this);
	        }));

	        return function (_x) {
	            return _ref.apply(this, arguments);
	        };
	    }();
	}

	function postMessage(content, startTime, ttl) {
	    var _this2 = this;

	    return function () {
	        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(dispatch) {
	            var link;
	            return regeneratorRuntime.wrap(function _callee2$(_context2) {
	                while (1) {
	                    switch (_context2.prev = _context2.next) {
	                        case 0:
	                            _context2.next = 2;
	                            return dispatch({
	                                type: _constants.POST_MESSAGE_REQUEST
	                            });

	                        case 2:
	                            _context2.prev = 2;
	                            _context2.next = 5;
	                            return utils.postMessage(content, startTime, ttl);

	                        case 5:
	                            link = _context2.sent;
	                            _context2.next = 8;
	                            return dispatch({
	                                type: _constants.RESET_MESSAGE_IDS
	                            });

	                        case 8:
	                            _context2.next = 10;
	                            return dispatch({
	                                type: _constants.POST_MESSAGE_SUCCESS,
	                                payload: link
	                            });

	                        case 10:
	                            return _context2.abrupt("return", _context2.sent);

	                        case 13:
	                            _context2.prev = 13;
	                            _context2.t0 = _context2["catch"](2);
	                            _context2.next = 17;
	                            return dispatch({
	                                type: _constants.POST_MESSAGE_FAILURE,
	                                payload: {
	                                    errno: _context2.t0.errno,
	                                    message: _context2.t0.message,
	                                    detail: _context2.t0.detail
	                                },
	                                error: true
	                            });

	                        case 17:
	                            return _context2.abrupt("return", _context2.sent);

	                        case 18:
	                        case "end":
	                            return _context2.stop();
	                    }
	                }
	            }, _callee2, _this2, [[2, 13]]);
	        }));

	        return function (_x2) {
	            return _ref2.apply(this, arguments);
	        };
	    }();
	}

	function resetPublishState() {
	    return {
	        type: _constants.RESET_PUBLISH_STATE
	    };
	}

	function getMessageIds(ignoreCache) {
	    var _this3 = this;

	    return function () {
	        var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(dispatch) {
	            var ids;
	            return regeneratorRuntime.wrap(function _callee3$(_context3) {
	                while (1) {
	                    switch (_context3.prev = _context3.next) {
	                        case 0:
	                            _context3.next = 2;
	                            return dispatch({
	                                type: _constants.GET_MESSAGE_IDS_REQUEST
	                            });

	                        case 2:
	                            _context3.prev = 2;
	                            _context3.next = 5;
	                            return utils.getMessageIds(ignoreCache);

	                        case 5:
	                            ids = _context3.sent;
	                            _context3.next = 8;
	                            return dispatch({
	                                type: _constants.GET_MESSAGE_IDS_SUCCESS,
	                                payload: ids
	                            });

	                        case 8:
	                            return _context3.abrupt("return", _context3.sent);

	                        case 11:
	                            _context3.prev = 11;
	                            _context3.t0 = _context3["catch"](2);
	                            _context3.next = 15;
	                            return dispatch({
	                                type: _constants.GET_MESSAGE_IDS_FAILURE,
	                                payload: {
	                                    errno: _context3.t0.errno,
	                                    message: _context3.t0.message
	                                },
	                                error: true
	                            });

	                        case 15:
	                            return _context3.abrupt("return", _context3.sent);

	                        case 16:
	                        case "end":
	                            return _context3.stop();
	                    }
	                }
	            }, _callee3, _this3, [[2, 11]]);
	        }));

	        return function (_x3) {
	            return _ref3.apply(this, arguments);
	        };
	    }();
	}

	function removeMessage(id) {
	    var _this4 = this;

	    return function () {
	        var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(dispatch) {
	            return regeneratorRuntime.wrap(function _callee4$(_context4) {
	                while (1) {
	                    switch (_context4.prev = _context4.next) {
	                        case 0:
	                            _context4.next = 2;
	                            return dispatch({
	                                type: _constants.REMOVE_MESSAGE_REQUEST,
	                                payload: id
	                            });

	                        case 2:
	                            _context4.prev = 2;
	                            _context4.next = 5;
	                            return utils.removeMessage(id);

	                        case 5:
	                            console.log(id);
	                            _context4.next = 8;
	                            return dispatch(getMessageIds(true));

	                        case 8:
	                            return _context4.abrupt("return", _context4.sent);

	                        case 11:
	                            _context4.prev = 11;
	                            _context4.t0 = _context4["catch"](2);
	                            _context4.next = 15;
	                            return dispatch({
	                                type: _constants.REMOVE_MESSAGE_FAILURE,
	                                payload: {
	                                    id: id,
	                                    errno: _context4.t0.errno,
	                                    message: _context4.t0.message
	                                },
	                                error: true
	                            });

	                        case 15:
	                            return _context4.abrupt("return", _context4.sent);

	                        case 16:
	                        case "end":
	                            return _context4.stop();
	                    }
	                }
	            }, _callee4, _this4, [[2, 11]]);
	        }));

	        return function (_x4) {
	            return _ref4.apply(this, arguments);
	        };
	    }();
	}

	function register(username, password, email) {
	    var _this5 = this;

	    return function () {
	        var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(dispatch) {
	            return regeneratorRuntime.wrap(function _callee5$(_context5) {
	                while (1) {
	                    switch (_context5.prev = _context5.next) {
	                        case 0:
	                            _context5.next = 2;
	                            return dispatch({
	                                type: _constants.REGISTER_USER_REQUEST
	                            });

	                        case 2:
	                            _context5.prev = 2;
	                            _context5.next = 5;
	                            return utils.register(username, password, email);

	                        case 5:
	                            _context5.next = 7;
	                            return dispatch({
	                                type: _constants.REGISTER_USER_SUCCESS
	                            });

	                        case 7:
	                            return _context5.abrupt("return", _context5.sent);

	                        case 10:
	                            _context5.prev = 10;
	                            _context5.t0 = _context5["catch"](2);
	                            _context5.next = 14;
	                            return dispatch({
	                                type: _constants.REGISTER_USER_FAILURE,
	                                payload: {
	                                    errno: _context5.t0.errno,
	                                    message: _context5.t0.message,
	                                    detail: _context5.t0.detail
	                                },
	                                error: true
	                            });

	                        case 14:
	                            return _context5.abrupt("return", _context5.sent);

	                        case 15:
	                        case "end":
	                            return _context5.stop();
	                    }
	                }
	            }, _callee5, _this5, [[2, 10]]);
	        }));

	        return function (_x5) {
	            return _ref5.apply(this, arguments);
	        };
	    }();
	}

	function login(username, password) {
	    var _this6 = this;

	    var isRemember = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	    return function () {
	        var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(dispatch) {
	            return regeneratorRuntime.wrap(function _callee6$(_context6) {
	                while (1) {
	                    switch (_context6.prev = _context6.next) {
	                        case 0:
	                            _context6.next = 2;
	                            return dispatch({
	                                type: _constants.LOGIN_REQUEST
	                            });

	                        case 2:
	                            _context6.prev = 2;
	                            _context6.next = 5;
	                            return utils.login(username, password, isRemember);

	                        case 5:
	                            _context6.next = 7;
	                            return dispatch({
	                                type: _constants.LOGIN_SUCCESS
	                            });

	                        case 7:
	                            return _context6.abrupt("return", _context6.sent);

	                        case 10:
	                            _context6.prev = 10;
	                            _context6.t0 = _context6["catch"](2);
	                            _context6.next = 14;
	                            return dispatch({
	                                type: _constants.LOGIN_FAILURE,
	                                payload: {
	                                    errno: _context6.t0.errno,
	                                    message: _context6.t0.message
	                                },
	                                error: true
	                            });

	                        case 14:
	                            return _context6.abrupt("return", _context6.sent);

	                        case 15:
	                        case "end":
	                            return _context6.stop();
	                    }
	                }
	            }, _callee6, _this6, [[2, 10]]);
	        }));

	        return function (_x7) {
	            return _ref6.apply(this, arguments);
	        };
	    }();
	}

	function logout() {
	    var _this7 = this;

	    return function () {
	        var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(dispatch) {
	            return regeneratorRuntime.wrap(function _callee7$(_context7) {
	                while (1) {
	                    switch (_context7.prev = _context7.next) {
	                        case 0:
	                            _context7.next = 2;
	                            return dispatch({
	                                type: _constants.LOGOUT_REQUEST
	                            });

	                        case 2:
	                            _context7.prev = 2;
	                            _context7.next = 5;
	                            return utils.logout();

	                        case 5:
	                            _context7.next = 9;
	                            break;

	                        case 7:
	                            _context7.prev = 7;
	                            _context7.t0 = _context7["catch"](2);

	                        case 9:
	                            _context7.next = 11;
	                            return Promise.all([dispatch({
	                                type: _constants.LOGOUT_SUCCESS
	                            }), dispatch({
	                                type: _constants.RESET_LOGIN
	                            })]);

	                        case 11:
	                            return _context7.abrupt("return", _context7.sent);

	                        case 12:
	                        case "end":
	                            return _context7.stop();
	                    }
	                }
	            }, _callee7, _this7, [[2, 7]]);
	        }));

	        return function (_x8) {
	            return _ref7.apply(this, arguments);
	        };
	    }();
	}

/***/ },

/***/ 328:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _customError = __webpack_require__(329);

	Object.keys(_customError).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _customError[key];
	    }
	  });
	});

	var _api = __webpack_require__(330);

	Object.keys(_api).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _api[key];
	    }
	  });
	});

	var _helper = __webpack_require__(332);

	Object.keys(_helper).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _helper[key];
	    }
	  });
	});

/***/ },

/***/ 329:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.UnknowError = exports.PostMessageError = exports.RegisterError = exports.LoginError = exports.AuthError = exports.TimeoutError = exports.FetchParseBodyError = exports.FetchError = exports.ServerError = exports.ClientError = undefined;

	var _constants = __webpack_require__(23);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ClientError = exports.ClientError = function (_Error) {
	    _inherits(ClientError, _Error);

	    function ClientError(msg) {
	        _classCallCheck(this, ClientError);

	        var _this = _possibleConstructorReturn(this, (ClientError.__proto__ || Object.getPrototypeOf(ClientError)).call(this, msg));

	        _this.errno = _constants.CLIENT_ERROR;
	        return _this;
	    }

	    return ClientError;
	}(Error);

	var ServerError = exports.ServerError = function (_Error2) {
	    _inherits(ServerError, _Error2);

	    function ServerError(msg) {
	        _classCallCheck(this, ServerError);

	        var _this2 = _possibleConstructorReturn(this, (ServerError.__proto__ || Object.getPrototypeOf(ServerError)).call(this, msg));

	        _this2.errno = _constants.SERVER_ERROR;
	        return _this2;
	    }

	    return ServerError;
	}(Error);

	var FetchError = exports.FetchError = function (_Error3) {
	    _inherits(FetchError, _Error3);

	    function FetchError(msg) {
	        _classCallCheck(this, FetchError);

	        var _this3 = _possibleConstructorReturn(this, (FetchError.__proto__ || Object.getPrototypeOf(FetchError)).call(this, msg));

	        _this3.errno = _constants.FETCH_ERROR;
	        return _this3;
	    }

	    return FetchError;
	}(Error);

	var FetchParseBodyError = exports.FetchParseBodyError = function (_Error4) {
	    _inherits(FetchParseBodyError, _Error4);

	    function FetchParseBodyError(msg) {
	        _classCallCheck(this, FetchParseBodyError);

	        var _this4 = _possibleConstructorReturn(this, (FetchParseBodyError.__proto__ || Object.getPrototypeOf(FetchParseBodyError)).call(this, msg));

	        _this4.errno = _constants.FETCH_PARSE_BODY_ERROR;
	        return _this4;
	    }

	    return FetchParseBodyError;
	}(Error);

	var TimeoutError = exports.TimeoutError = function (_Error5) {
	    _inherits(TimeoutError, _Error5);

	    function TimeoutError(msg) {
	        _classCallCheck(this, TimeoutError);

	        var _this5 = _possibleConstructorReturn(this, (TimeoutError.__proto__ || Object.getPrototypeOf(TimeoutError)).call(this, msg));

	        _this5.errno = _constants.TIMEOUT_ERROR;
	        return _this5;
	    }

	    return TimeoutError;
	}(Error);

	var AuthError = exports.AuthError = function (_Error6) {
	    _inherits(AuthError, _Error6);

	    function AuthError(msg) {
	        _classCallCheck(this, AuthError);

	        var _this6 = _possibleConstructorReturn(this, (AuthError.__proto__ || Object.getPrototypeOf(AuthError)).call(this, msg));

	        _this6.errno = _constants.AUTH_ERROR;
	        return _this6;
	    }

	    return AuthError;
	}(Error);

	var LoginError = exports.LoginError = function (_Error7) {
	    _inherits(LoginError, _Error7);

	    function LoginError(msg) {
	        _classCallCheck(this, LoginError);

	        var _this7 = _possibleConstructorReturn(this, (LoginError.__proto__ || Object.getPrototypeOf(LoginError)).call(this, msg));

	        _this7.errno = _constants.LOGIN_ERROR;
	        return _this7;
	    }

	    return LoginError;
	}(Error);

	var RegisterError = exports.RegisterError = function (_Error8) {
	    _inherits(RegisterError, _Error8);

	    function RegisterError(msg, detail) {
	        _classCallCheck(this, RegisterError);

	        var _this8 = _possibleConstructorReturn(this, (RegisterError.__proto__ || Object.getPrototypeOf(RegisterError)).call(this, msg));

	        _this8.errno = _constants.REGISTER_ERROR;
	        _this8.detail = detail;
	        return _this8;
	    }

	    return RegisterError;
	}(Error);

	var PostMessageError = exports.PostMessageError = function (_Error9) {
	    _inherits(PostMessageError, _Error9);

	    function PostMessageError(msg, detail) {
	        _classCallCheck(this, PostMessageError);

	        var _this9 = _possibleConstructorReturn(this, (PostMessageError.__proto__ || Object.getPrototypeOf(PostMessageError)).call(this, msg));

	        _this9.errno = _constants.POST_MESSAGE_ERROR;
	        _this9.detail = detail;
	        return _this9;
	    }

	    return PostMessageError;
	}(Error);

	var UnknowError = exports.UnknowError = function (_Error10) {
	    _inherits(UnknowError, _Error10);

	    function UnknowError(msg) {
	        _classCallCheck(this, UnknowError);

	        var _this10 = _possibleConstructorReturn(this, (UnknowError.__proto__ || Object.getPrototypeOf(UnknowError)).call(this, msg));

	        _this10.errno = _constants.UNKNOW_ERROR;
	        return _this10;
	    }

	    return UnknowError;
	}(Error);

/***/ },

/***/ 330:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.logout = exports.login = exports.register = exports.removeMessage = exports.getMessageIds = exports.postMessage = exports.updateEmail = exports.updateNickName = exports.updatePassword = exports.getUserInfo = exports.updateUserInfo = undefined;

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	/**
	 * @param {string} token
	 * @return {Object} - userInfo
	 * @throws {AuthError} - 用户未登录或已登出
	 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
	 * @throws {FetchParseBodyError} - parse response.body 时出错
	 * @throws {ClientError} - 客户端错误
	 * @throws {ServerError} - 服务端内部错误
	 */
	var getUserInfoByToken = function () {
	    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(token) {
	        var username, response, body;
	        return regeneratorRuntime.wrap(function _callee$(_context) {
	            while (1) {
	                switch (_context.prev = _context.next) {
	                    case 0:
	                        username = void 0;
	                        _context.prev = 1;

	                        username = getUsernameFromToken(token);
	                        _context.next = 8;
	                        break;

	                    case 5:
	                        _context.prev = 5;
	                        _context.t0 = _context["catch"](1);
	                        throw new _customError.AuthError();

	                    case 8:
	                        response = void 0;
	                        _context.prev = 9;
	                        _context.next = 12;
	                        return fetch(USER_INFO_ENDPOINT + "/" + username, {
	                            method: "GET",
	                            headers: {
	                                "Authorization": "Bearer " + token,
	                                "Accept": "application/json"
	                            }
	                        });

	                    case 12:
	                        response = _context.sent;
	                        _context.next = 18;
	                        break;

	                    case 15:
	                        _context.prev = 15;
	                        _context.t1 = _context["catch"](9);
	                        throw new _customError.FetchError(_context.t1.message);

	                    case 18:
	                        body = void 0;
	                        _context.prev = 19;

	                        if (!/\bjson\b/i.test(response.headers.get("Content-Type"))) {
	                            _context.next = 26;
	                            break;
	                        }

	                        _context.next = 23;
	                        return response.json();

	                    case 23:
	                        body = _context.sent;
	                        _context.next = 29;
	                        break;

	                    case 26:
	                        _context.next = 28;
	                        return response.text();

	                    case 28:
	                        body = _context.sent;

	                    case 29:
	                        _context.next = 34;
	                        break;

	                    case 31:
	                        _context.prev = 31;
	                        _context.t2 = _context["catch"](19);
	                        throw new _customError.FetchParseBodyError(_context.t2.message);

	                    case 34:
	                        if (!response.ok) {
	                            _context.next = 38;
	                            break;
	                        }

	                        return _context.abrupt("return", body);

	                    case 38:
	                        if (!(response.status === 401)) {
	                            _context.next = 42;
	                            break;
	                        }

	                        throw new _customError.AuthError(getMessageFromBody(body));

	                    case 42:
	                        if (!(response.status >= 400 && response.status < 500)) {
	                            _context.next = 46;
	                            break;
	                        }

	                        throw new _customError.ClientError(getMessageFromBody(body));

	                    case 46:
	                        if (!(response.status >= 500)) {
	                            _context.next = 48;
	                            break;
	                        }

	                        throw new _customError.ServerError(getMessageFromBody(body) || response.statusText);

	                    case 48:
	                    case "end":
	                        return _context.stop();
	                }
	            }
	        }, _callee, this, [[1, 5], [9, 15], [19, 31]]);
	    }));

	    return function getUserInfoByToken(_x) {
	        return _ref.apply(this, arguments);
	    };
	}();

	var updateUserInfo = exports.updateUserInfo = function () {
	    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(info) {
	        return regeneratorRuntime.wrap(function _callee2$(_context2) {
	            while (1) {
	                switch (_context2.prev = _context2.next) {
	                    case 0:
	                        _sharedSessionStorage2.default.setItem(_constants.SESSION_KEY_USER_INFO, JSON.stringify(info));

	                    case 1:
	                    case "end":
	                        return _context2.stop();
	                }
	            }
	        }, _callee2, this);
	    }));

	    return function updateUserInfo(_x2) {
	        return _ref2.apply(this, arguments);
	    };
	}();

	/**
	 * @param {boolean} [ignoreCache = false]
	 * @return {Object?}
	 */


	var getUserInfo = exports.getUserInfo = function () {
	    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
	        var ignoreCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
	        var result, token, userInfo;
	        return regeneratorRuntime.wrap(function _callee3$(_context3) {
	            while (1) {
	                switch (_context3.prev = _context3.next) {
	                    case 0:
	                        if (ignoreCache) {
	                            _context3.next = 4;
	                            break;
	                        }

	                        result = getUserInfoFromLocal();

	                        if (!result) {
	                            _context3.next = 4;
	                            break;
	                        }

	                        return _context3.abrupt("return", result);

	                    case 4:
	                        token = getToken();

	                        if (token) {
	                            _context3.next = 7;
	                            break;
	                        }

	                        return _context3.abrupt("return", null);

	                    case 7:
	                        userInfo = void 0;
	                        _context3.prev = 8;
	                        _context3.next = 11;
	                        return getUserInfoByToken(token);

	                    case 11:
	                        userInfo = _context3.sent;
	                        _context3.next = 18;
	                        break;

	                    case 14:
	                        _context3.prev = 14;
	                        _context3.t0 = _context3["catch"](8);

	                        if (_context3.t0 instanceof _customError.AuthError) {
	                            clearToekn();
	                        }
	                        return _context3.abrupt("return", null);

	                    case 18:
	                        if (userInfo) {
	                            _context3.next = 20;
	                            break;
	                        }

	                        return _context3.abrupt("return", null);

	                    case 20:

	                        try {
	                            _sharedSessionStorage2.default.setItem(_constants.SESSION_KEY_USER_INFO, JSON.stringify(userInfo));
	                        } catch (ex) {
	                            // TODO logger
	                        }
	                        return _context3.abrupt("return", userInfo);

	                    case 22:
	                    case "end":
	                        return _context3.stop();
	                }
	            }
	        }, _callee3, this, [[8, 14]]);
	    }));

	    return function getUserInfo(_x3) {
	        return _ref3.apply(this, arguments);
	    };
	}();

	var updatePassword = exports.updatePassword = function () {
	    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(oldPassword, newPassword) {
	        return regeneratorRuntime.wrap(function _callee4$(_context4) {
	            while (1) {
	                switch (_context4.prev = _context4.next) {
	                    case 0:
	                    case "end":
	                        return _context4.stop();
	                }
	            }
	        }, _callee4, this);
	    }));

	    return function updatePassword(_x5, _x6) {
	        return _ref4.apply(this, arguments);
	    };
	}();

	var updateNickName = exports.updateNickName = function () {
	    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(nickname) {
	        return regeneratorRuntime.wrap(function _callee5$(_context5) {
	            while (1) {
	                switch (_context5.prev = _context5.next) {
	                    case 0:
	                    case "end":
	                        return _context5.stop();
	                }
	            }
	        }, _callee5, this);
	    }));

	    return function updateNickName(_x7) {
	        return _ref5.apply(this, arguments);
	    };
	}();

	var updateEmail = exports.updateEmail = function () {
	    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(email) {
	        return regeneratorRuntime.wrap(function _callee6$(_context6) {
	            while (1) {
	                switch (_context6.prev = _context6.next) {
	                    case 0:
	                    case "end":
	                        return _context6.stop();
	                }
	            }
	        }, _callee6, this);
	    }));

	    return function updateEmail(_x8) {
	        return _ref6.apply(this, arguments);
	    };
	}();

	/**
	 * @param {string} content
	 * @param {number} startTime
	 * @param {number} ttl
	 * @return {string} - link
	 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
	 * @throws {FetchParseBodyError} - parse response.body 时出错
	 * @throws {ServerError} - 服务端内部错误
	 * @throws {Error} - 其他错误
	 */
	var postMessage = exports.postMessage = function () {
	    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(content, startTime, ttl) {
	        var token, headers, response, _ref8, id, body;

	        return regeneratorRuntime.wrap(function _callee7$(_context7) {
	            while (1) {
	                switch (_context7.prev = _context7.next) {
	                    case 0:
	                        token = getToken();
	                        headers = {
	                            "Accept": "application/json",
	                            "Content-Type": "application/json"
	                        };

	                        if (token) {
	                            headers["Authorization"] = "Bearer " + token;
	                        }
	                        response = void 0;
	                        _context7.prev = 4;
	                        _context7.next = 7;
	                        return fetch("" + MESSAGE_ENDPOINT, {
	                            method: "POST",
	                            headers: headers,
	                            body: JSON.stringify({
	                                content: content,
	                                startTime: startTime,
	                                ttl: ttl
	                            })
	                        });

	                    case 7:
	                        response = _context7.sent;
	                        _context7.next = 13;
	                        break;

	                    case 10:
	                        _context7.prev = 10;
	                        _context7.t0 = _context7["catch"](4);
	                        throw new _customError.FetchError(_context7.t0.message);

	                    case 13:
	                        if (!response.ok) {
	                            _context7.next = 26;
	                            break;
	                        }

	                        _context7.prev = 14;
	                        _context7.next = 17;
	                        return response.json();

	                    case 17:
	                        _ref8 = _context7.sent;
	                        id = _ref8.id;

	                        if (token) {
	                            clearMessageIds();
	                        }
	                        return _context7.abrupt("return", "https://awhile.online/" + (token ? "m" : "anonymous") + "/" + id);

	                    case 23:
	                        _context7.prev = 23;
	                        _context7.t1 = _context7["catch"](14);
	                        throw new _customError.FetchParseBodyError(_context7.t1.message);

	                    case 26:
	                        body = void 0;
	                        _context7.prev = 27;
	                        _context7.next = 30;
	                        return response.json();

	                    case 30:
	                        body = _context7.sent;
	                        _context7.next = 35;
	                        break;

	                    case 33:
	                        _context7.prev = 33;
	                        _context7.t2 = _context7["catch"](27);

	                    case 35:
	                        if (!(response.status === 400 && body.detail)) {
	                            _context7.next = 39;
	                            break;
	                        }

	                        throw new _customError.PostMessageError(body.message, body.detail);

	                    case 39:
	                        if (!(response.status >= 400 && response.status < 500)) {
	                            _context7.next = 41;
	                            break;
	                        }

	                        throw new _customError.ClientError(getMessageFromBody(body));

	                    case 41:
	                        if (!(response.status >= 500)) {
	                            _context7.next = 43;
	                            break;
	                        }

	                        throw new _customError.ServerError(getMessageFromBody(body));

	                    case 43:
	                        throw new Error(getMessageFromBody(body));

	                    case 44:
	                    case "end":
	                        return _context7.stop();
	                }
	            }
	        }, _callee7, this, [[4, 10], [14, 23], [27, 33]]);
	    }));

	    return function postMessage(_x9, _x10, _x11) {
	        return _ref7.apply(this, arguments);
	    };
	}();

	/**
	 * @param {boolean} [ignoreCache = false]
	 * @return {string[]} - ids
	 * @throws {AuthError} - 用户未登录或已登出
	 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
	 * @throws {FetchParseBodyError} - parse response.body 时出错
	 * @throws {ServerError} - 服务端内部错误
	 * @throws {UnknowError} - 其他错误
	 */


	var getMessageIds = exports.getMessageIds = function () {
	    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
	        var ignoreCache = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	        var result, token, username, response, _result, body;

	        return regeneratorRuntime.wrap(function _callee8$(_context8) {
	            while (1) {
	                switch (_context8.prev = _context8.next) {
	                    case 0:
	                        if (ignoreCache) {
	                            _context8.next = 4;
	                            break;
	                        }

	                        result = getMessageIdsFromLocal();

	                        if (!result) {
	                            _context8.next = 4;
	                            break;
	                        }

	                        return _context8.abrupt("return", result);

	                    case 4:
	                        token = getToken();

	                        if (token) {
	                            _context8.next = 7;
	                            break;
	                        }

	                        throw new _customError.AuthError("用户已登出！");

	                    case 7:
	                        username = void 0;
	                        _context8.prev = 8;

	                        username = getUsernameFromToken(token);
	                        _context8.next = 16;
	                        break;

	                    case 12:
	                        _context8.prev = 12;
	                        _context8.t0 = _context8["catch"](8);

	                        clearToekn();
	                        throw new _customError.AuthError("用户已登出！");

	                    case 16:
	                        response = void 0;
	                        _context8.prev = 17;
	                        _context8.next = 20;
	                        return fetch(USER_INFO_ENDPOINT + "/" + username + "/messages", {
	                            method: "GET",
	                            headers: {
	                                "Authorization": "Bearer " + token,
	                                "Accept": "application/json"
	                            }
	                        });

	                    case 20:
	                        response = _context8.sent;
	                        _context8.next = 26;
	                        break;

	                    case 23:
	                        _context8.prev = 23;
	                        _context8.t1 = _context8["catch"](17);
	                        throw new _customError.FetchError(_context8.t1.message);

	                    case 26:
	                        if (!response.ok) {
	                            _context8.next = 39;
	                            break;
	                        }

	                        _result = void 0;
	                        _context8.prev = 28;
	                        _context8.next = 31;
	                        return response.json();

	                    case 31:
	                        _result = _context8.sent;
	                        _context8.next = 37;
	                        break;

	                    case 34:
	                        _context8.prev = 34;
	                        _context8.t2 = _context8["catch"](28);
	                        throw new _customError.FetchParseBodyError(_context8.t2.message);

	                    case 37:
	                        try {
	                            _sharedSessionStorage2.default.setItem(_constants.SESSION_KEY_MESSAGE_IDS, JSON.stringify(_result));
	                        } catch (ex) {
	                            // TODO logger
	                        }
	                        return _context8.abrupt("return", _result);

	                    case 39:
	                        body = void 0;
	                        _context8.prev = 40;
	                        _context8.next = 43;
	                        return response.json();

	                    case 43:
	                        body = _context8.sent;
	                        _context8.next = 48;
	                        break;

	                    case 46:
	                        _context8.prev = 46;
	                        _context8.t3 = _context8["catch"](40);

	                    case 48:
	                        if (!(response.status >= 400 && response.status < 500)) {
	                            _context8.next = 53;
	                            break;
	                        }

	                        clearToekn();
	                        throw new _customError.AuthError(getMessageFromBody(body));

	                    case 53:
	                        if (!(response.status >= 500)) {
	                            _context8.next = 57;
	                            break;
	                        }

	                        throw new _customError.ServerError(getMessageFromBody(body));

	                    case 57:
	                        throw new _customError.UnknowError(getMessageFromBody(body));

	                    case 58:
	                    case "end":
	                        return _context8.stop();
	                }
	            }
	        }, _callee8, this, [[8, 12], [17, 23], [28, 34], [40, 46]]);
	    }));

	    return function getMessageIds(_x12) {
	        return _ref9.apply(this, arguments);
	    };
	}();

	/**
	 * @param {string} id
	 * @throws {AuthError} - 用户未登录或已登出
	 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
	 * @throws {FetchParseBodyError} - parse response.body 时出错
	 * @throws {ServerError} - 服务端内部错误
	 * @throws {UnknowError} - 其他错误
	 */


	var removeMessage = exports.removeMessage = function () {
	    var _ref10 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(id) {
	        var token, response, ids, idx, body;
	        return regeneratorRuntime.wrap(function _callee9$(_context9) {
	            while (1) {
	                switch (_context9.prev = _context9.next) {
	                    case 0:
	                        token = getToken();

	                        if (token) {
	                            _context9.next = 3;
	                            break;
	                        }

	                        throw new _customError.AuthError("用户已登出！");

	                    case 3:
	                        response = void 0;
	                        _context9.prev = 4;
	                        _context9.next = 7;
	                        return fetch(MESSAGE_ENDPOINT + "/" + id, {
	                            method: "DELETE",
	                            headers: {
	                                "Authorization": "Bearer " + token,
	                                "Accept": "javascript/json"
	                            }
	                        });

	                    case 7:
	                        response = _context9.sent;
	                        _context9.next = 13;
	                        break;

	                    case 10:
	                        _context9.prev = 10;
	                        _context9.t0 = _context9["catch"](4);
	                        throw new _customError.FetchError(_context9.t0.message);

	                    case 13:
	                        if (!response.ok) {
	                            _context9.next = 17;
	                            break;
	                        }

	                        ids = getMessageIdsFromLocal();

	                        if (ids) {
	                            idx = ids.indexOf(id);

	                            if (idx > -1) {
	                                ids.splice(idx, 1);
	                                setMessageIdsToLocal(ids);
	                            }
	                        }
	                        return _context9.abrupt("return", id);

	                    case 17:
	                        body = void 0;
	                        _context9.prev = 18;
	                        _context9.next = 21;
	                        return response.json();

	                    case 21:
	                        body = _context9.sent;
	                        _context9.next = 26;
	                        break;

	                    case 24:
	                        _context9.prev = 24;
	                        _context9.t1 = _context9["catch"](18);

	                    case 26:
	                        if (!(response.status === 401)) {
	                            _context9.next = 30;
	                            break;
	                        }

	                        throw new _customError.AuthError(getMessageFromBody(body));

	                    case 30:
	                        if (!(response.status >= 500)) {
	                            _context9.next = 34;
	                            break;
	                        }

	                        throw new _customError.ServerError(getMessageFromBody(body));

	                    case 34:
	                        throw new _customError.UnknowError(getMessageFromBody(body));

	                    case 35:
	                    case "end":
	                        return _context9.stop();
	                }
	            }
	        }, _callee9, this, [[4, 10], [18, 24]]);
	    }));

	    return function removeMessage(_x14) {
	        return _ref10.apply(this, arguments);
	    };
	}();

	/**
	 * @param {string} username
	 * @param {string} password
	 * @param {email} [email]
	 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
	 * @throws {ServerError} - 服务端内部错误
	 * @throws {UnknowError} - 其他错误
	 * @throws {RegisterError} - 注册出错
	 */


	var register = exports.register = function () {
	    var _ref11 = _asyncToGenerator(regeneratorRuntime.mark(function _callee10(username, password, email) {
	        var response, body;
	        return regeneratorRuntime.wrap(function _callee10$(_context10) {
	            while (1) {
	                switch (_context10.prev = _context10.next) {
	                    case 0:
	                        response = void 0;
	                        _context10.prev = 1;
	                        _context10.next = 4;
	                        return fetch(USER_INFO_ENDPOINT, {
	                            method: "POST",
	                            headers: {
	                                "Accept": "application/json",
	                                "Content-Type": "application/json"
	                            },
	                            body: JSON.stringify({
	                                username: username,
	                                password: password,
	                                email: email
	                            })
	                        });

	                    case 4:
	                        response = _context10.sent;
	                        _context10.next = 10;
	                        break;

	                    case 7:
	                        _context10.prev = 7;
	                        _context10.t0 = _context10["catch"](1);
	                        throw new _customError.FetchError(_context10.t0.message);

	                    case 10:
	                        if (!response.ok) {
	                            _context10.next = 12;
	                            break;
	                        }

	                        return _context10.abrupt("return");

	                    case 12:
	                        body = void 0;
	                        _context10.prev = 13;
	                        _context10.next = 16;
	                        return response.json();

	                    case 16:
	                        body = _context10.sent;
	                        _context10.next = 21;
	                        break;

	                    case 19:
	                        _context10.prev = 19;
	                        _context10.t1 = _context10["catch"](13);

	                    case 21:
	                        if (!(response.status === 400)) {
	                            _context10.next = 25;
	                            break;
	                        }

	                        throw new _customError.RegisterError(body.message, body.detail);

	                    case 25:
	                        if (!(response.status >= 500)) {
	                            _context10.next = 29;
	                            break;
	                        }

	                        throw new _customError.ServerError(getMessageFromBody(body));

	                    case 29:
	                        throw new _customError.UnknowError(getMessageFromBody(body));

	                    case 30:
	                    case "end":
	                        return _context10.stop();
	                }
	            }
	        }, _callee10, this, [[1, 7], [13, 19]]);
	    }));

	    return function register(_x15, _x16, _x17) {
	        return _ref11.apply(this, arguments);
	    };
	}();

	/**
	 * 如果登录失败，将抛出异常
	 * @param {string} username
	 * @param {string} password
	 * @param {boolean} isRemember
	 * @throws {FetchError} - fetch 出错，一般是超时或无网络连接等
	 * @throws {LoginError} - 登录出错
	 */


	var login = exports.login = function () {
	    var _ref12 = _asyncToGenerator(regeneratorRuntime.mark(function _callee11(username, password, isRemember) {
	        var response, _ref13, token, _ref14, message;

	        return regeneratorRuntime.wrap(function _callee11$(_context11) {
	            while (1) {
	                switch (_context11.prev = _context11.next) {
	                    case 0:
	                        response = void 0;
	                        _context11.prev = 1;
	                        _context11.next = 4;
	                        return fetch(USER_AUTH_ENDPOINT, {
	                            method: "POST",
	                            headers: {
	                                "Accept": "application/json",
	                                "Content-Type": "application/json"
	                            },
	                            body: JSON.stringify({
	                                username: username,
	                                password: password,
	                                rememberMe: isRemember
	                            })
	                        });

	                    case 4:
	                        response = _context11.sent;
	                        _context11.next = 10;
	                        break;

	                    case 7:
	                        _context11.prev = 7;
	                        _context11.t0 = _context11["catch"](1);
	                        throw new _customError.FetchError(_context11.t0.message);

	                    case 10:
	                        if (!response.ok) {
	                            _context11.next = 19;
	                            break;
	                        }

	                        _context11.next = 13;
	                        return response.json();

	                    case 13:
	                        _ref13 = _context11.sent;
	                        token = _ref13.token;

	                        try {
	                            saveToken(token, isRemember);
	                        } catch (ex) {
	                            // TODO logger
	                        }
	                        return _context11.abrupt("return", token);

	                    case 19:
	                        _context11.next = 21;
	                        return response.json();

	                    case 21:
	                        _ref14 = _context11.sent;
	                        message = _ref14.message;
	                        throw new _customError.LoginError(message);

	                    case 24:
	                    case "end":
	                        return _context11.stop();
	                }
	            }
	        }, _callee11, this, [[1, 7]]);
	    }));

	    return function login(_x18, _x19, _x20) {
	        return _ref12.apply(this, arguments);
	    };
	}();

	/**
	 * @throws {AuthError} - 用户未登录或已登出
	 */


	var logout = exports.logout = function () {
	    var _ref15 = _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
	        var token;
	        return regeneratorRuntime.wrap(function _callee12$(_context12) {
	            while (1) {
	                switch (_context12.prev = _context12.next) {
	                    case 0:
	                        token = getToken();

	                        if (token) {
	                            _context12.next = 3;
	                            break;
	                        }

	                        throw new _customError.AuthError("用户已登出！");

	                    case 3:
	                        try {
	                            clearToekn();
	                            clearUserInfo();
	                            clearMessageIds();
	                        } catch (ex) {
	                            // empty
	                        }
	                        _context12.next = 6;
	                        return fetch(USER_AUTH_ENDPOINT, {
	                            method: "DELETE",
	                            headers: {
	                                "Authorization": "Bearer " + token
	                            }
	                        });

	                    case 6:
	                    case "end":
	                        return _context12.stop();
	                }
	            }
	        }, _callee12, this);
	    }));

	    return function logout() {
	        return _ref15.apply(this, arguments);
	    };
	}();

	var _customError = __webpack_require__(329);

	var _constants = __webpack_require__(23);

	var _sharedSessionStorage = __webpack_require__(331);

	var _sharedSessionStorage2 = _interopRequireDefault(_sharedSessionStorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

	var MESSAGE_ENDPOINT = "/api/messages";
	var USER_INFO_ENDPOINT = "/api/users";
	var USER_AUTH_ENDPOINT = "/api/authentication";

	function getToken() {
	    var ret = _sharedSessionStorage2.default.getItem(_constants.KEY_USER_TOKEN);
	    if (ret === null) {
	        return localStorage.getItem(_constants.KEY_USER_TOKEN);
	    } else {
	        return ret;
	    }
	}
	function clearToekn() {
	    var ret = _sharedSessionStorage2.default.getItem(_constants.KEY_USER_TOKEN);
	    if (ret !== null) {
	        _sharedSessionStorage2.default.removeItem(_constants.KEY_USER_TOKEN);
	    } else {
	        localStorage.removeItem(_constants.KEY_USER_TOKEN);
	    }
	}
	function clearUserInfo() {
	    _sharedSessionStorage2.default.removeItem(_constants.SESSION_KEY_USER_INFO);
	}

	function clearMessageIds() {
	    _sharedSessionStorage2.default.removeItem(_constants.SESSION_KEY_MESSAGE_IDS);
	}

	function saveToken(token, isRemember) {
	    if (isRemember) {
	        localStorage.setItem(_constants.KEY_USER_TOKEN, token);
	    } else {
	        _sharedSessionStorage2.default.setItem(_constants.KEY_USER_TOKEN, token);
	    }
	}

	function getUserInfoFromLocal() {
	    try {
	        return JSON.parse(_sharedSessionStorage2.default.getItem(_constants.SESSION_KEY_USER_INFO));
	    } catch (ex) {
	        // TODO logger
	    }
	}
	//function setUserInfoToLocal(info) {
	//    try {
	//        sharedSessionStorage.setItem(SESSION_KEY_USER_INFO, JSON.stringify(info));
	//    } catch (ex) {
	//        // empty
	//    }
	//}

	function getMessageIdsFromLocal() {
	    try {
	        return JSON.parse(_sharedSessionStorage2.default.getItem(_constants.SESSION_KEY_MESSAGE_IDS));
	    } catch (ex) {
	        // TODO logger
	    }
	}
	function setMessageIdsToLocal(ids) {
	    try {
	        _sharedSessionStorage2.default.setItem(_constants.SESSION_KEY_MESSAGE_IDS, JSON.stringify(ids));
	    } catch (ex) {
	        // empty
	    }
	}

	function getMessageFromBody(body) {
	    if (body && (typeof body === "undefined" ? "undefined" : _typeof(body)) === "object") {
	        if (body.message) {
	            return body.message;
	        } else {
	            return JSON.stringify(body, null, "  ");
	        }
	    } else {
	        return body;
	    }
	}

	function getUsernameFromToken(token) {
	    return JSON.parse(atob(token.split(".")[1])).aud;
	}

/***/ },

/***/ 332:
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isObjectEqual = isObjectEqual;
	function isObjectEqual(v1, v2) {
	    if (v1 == v2) {
	        return true;
	    }
	    var keys1 = Object.getOwnPropertyNames(v1).sort();
	    var keys2 = Object.getOwnPropertyNames(v2).sort();
	    if (keys1.length !== keys2.length) {
	        return false;
	    }
	    for (var i = 0, len = keys1.length; i < len; i++) {
	        var key = keys1[i];
	        if (keys2[i] !== key) {
	            return false;
	        }
	        if (v1[key] != v2[key]) {
	            return false;
	        }
	    }
	    return true;
	}

/***/ },

/***/ 333:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _home = __webpack_require__(334);

	Object.defineProperty(exports, "Home", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_home).default;
	  }
	});

	var _publish = __webpack_require__(460);

	Object.defineProperty(exports, "Publish", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_publish).default;
	  }
	});

	var _login = __webpack_require__(527);

	Object.defineProperty(exports, "Login", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_login).default;
	  }
	});

	var _register = __webpack_require__(528);

	Object.defineProperty(exports, "Register", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_register).default;
	  }
	});

	var _message = __webpack_require__(529);

	Object.defineProperty(exports, "Message", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_message).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },

/***/ 334:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _preact = __webpack_require__(1);

	var _components = __webpack_require__(335);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Home = function (_Component) {
	    _inherits(Home, _Component);

	    function Home() {
	        _classCallCheck(this, Home);

	        return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
	    }

	    _createClass(Home, [{
	        key: "render",
	        value: function render() {
	            var _props = this.props,
	                dispatch = _props.dispatch,
	                userInfo = _props.userInfo;

	            return (0, _preact.h)(
	                "div",
	                null,
	                (0, _preact.h)(_components.User, _extends({}, userInfo, { dispatch: dispatch })),
	                (0, _preact.h)(_components.Jumbotron, null),
	                (0, _preact.h)(
	                    "div",
	                    { "class": "mid" },
	                    (0, _preact.h)(
	                        "div",
	                        { "class": "main" },
	                        (0, _preact.h)(
	                            "div",
	                            { "class": "publish-btn-conatiner" },
	                            (0, _preact.h)(
	                                "a",
	                                { "class": "btn btn-primary btn-lg", href: "/publish.html" },
	                                "\u64B0\u5199\u6D88\u606F"
	                            )
	                        ),
	                        !userInfo.baseInfo && (0, _preact.h)(
	                            "div",
	                            { "class": "user-btn-conatiner" },
	                            (0, _preact.h)(
	                                "a",
	                                { "class": "btn btn-outline-secondary btn-lg", href: "/login.html" },
	                                "\u767B\u5F55"
	                            ),
	                            (0, _preact.h)(
	                                "a",
	                                { "class": "btn btn-outline-secondary btn-lg", href: "/register.html" },
	                                "\u6CE8\u518C"
	                            )
	                        )
	                    )
	                )
	            );
	        }
	    }]);

	    return Home;
	}(_preact.Component);

	exports.default = Home;

/***/ },

/***/ 335:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _user = __webpack_require__(336);

	Object.defineProperty(exports, "User", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_user).default;
	  }
	});

	var _jumbotron = __webpack_require__(337);

	Object.defineProperty(exports, "Jumbotron", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_jumbotron).default;
	  }
	});

	var _nav = __webpack_require__(338);

	Object.defineProperty(exports, "Nav", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_nav).default;
	  }
	});

	var _timeRange = __webpack_require__(339);

	Object.defineProperty(exports, "TimeRange", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_timeRange).default;
	  }
	});

	var _qrcode = __webpack_require__(450);

	Object.defineProperty(exports, "QRCode", {
	  enumerable: true,
	  get: function get() {
	    return _interopRequireDefault(_qrcode).default;
	  }
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },

/***/ 336:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _preact = __webpack_require__(1);

	var _actions = __webpack_require__(326);

	var actions = _interopRequireWildcard(_actions);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Messages = function Messages(_ref) {
	    var messageIds = _ref.value,
	        load = _ref.load,
	        onRemoveMessage = _ref.onRemoveMessage;

	    if (!messageIds) {
	        return null;
	    }
	    var content = function (ids) {
	        if (ids.loading) {
	            return (0, _preact.h)("div", { className: "loading" });
	        } else if (ids.error) {
	            return (0, _preact.h)(
	                "div",
	                { className: "load-failure" },
	                "\u52A0\u8F7D\u5931\u8D25\uFF01 ",
	                (0, _preact.h)(
	                    "a",
	                    { onClick: load, href: "javascript:" },
	                    "\u91CD\u8BD5"
	                )
	            );
	        } else if (!ids.content.length) {
	            return (0, _preact.h)(
	                "div",
	                { className: "empty" },
	                "\u65E0\u5185\u5BB9"
	            );
	        }
	        var messages = ids.content.map(function (obj, idx) {
	            var id = obj.id,
	                deleting = obj.deleting,
	                error = obj.error;

	            var cls = "";
	            if (deleting) {
	                cls = "deleting";
	            } else if (error) {
	                cls = "delete-failure";
	            }
	            return (0, _preact.h)(
	                "li",
	                { key: idx },
	                (0, _preact.h)(
	                    "a",
	                    { className: "link", href: "/m/" + obj.id, target: "_blank" },
	                    id
	                ),
	                (0, _preact.h)("a", { onClick: onRemoveMessage.bind(null, idx),
	                    className: "delete-btn " + cls, "aria-label": "delete button",
	                    title: error ? error.message : "Delete this message" })
	            );
	        });

	        return (0, _preact.h)(
	            "ul",
	            { className: "links" },
	            messages
	        );
	    }(messageIds);

	    return (0, _preact.h)(
	        "div",
	        { className: "messages" },
	        (0, _preact.h)(
	            "div",
	            { className: "label" },
	            "\u5DF2\u53D1\u5E03\u7684\u6D88\u606F\uFF1A"
	        ),
	        content
	    );
	};

	var User = function (_Component) {
	    _inherits(User, _Component);

	    function User() {
	        var _ref2;

	        _classCallCheck(this, User);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        var _this = _possibleConstructorReturn(this, (_ref2 = User.__proto__ || Object.getPrototypeOf(User)).call.apply(_ref2, [this].concat(args)));

	        _this.showInfo = _this.showInfo.bind(_this);
	        _this.hideInfo = _this.hideInfo.bind(_this);
	        _this.logout = _this.logout.bind(_this);
	        _this.handleRemoveMessage = _this.handleRemoveMessage.bind(_this);
	        _this.loadMessageIds = _this.loadMessageIds.bind(_this);
	        _this.state = {
	            shown: false
	        };
	        return _this;
	    }

	    _createClass(User, [{
	        key: "loadMessageIds",
	        value: function loadMessageIds() {
	            this.props.dispatch(actions.getMessageIds());
	        }
	    }, {
	        key: "showInfo",
	        value: function showInfo() {
	            var _this2 = this;

	            this.setState({
	                shown: true
	            }, function () {
	                _this2.loadMessageIds();
	            });
	        }
	    }, {
	        key: "hideInfo",
	        value: function hideInfo() {
	            this.setState({
	                shown: false
	            });
	        }
	    }, {
	        key: "logout",
	        value: function logout() {
	            this.props.dispatch(actions.logout());
	        }
	    }, {
	        key: "handleRemoveMessage",
	        value: function handleRemoveMessage(idx) {
	            var obj = this.props.messageIds.content[idx];
	            if (!obj || obj.deleting) return;
	            this.props.dispatch(actions.removeMessage(obj.id));
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _props = this.props,
	                baseInfo = _props.baseInfo,
	                messageIds = _props.messageIds;
	            var shown = this.state.shown;

	            if (!baseInfo) {
	                return null;
	            }

	            var detail = void 0;
	            if (shown) {
	                detail = [(0, _preact.h)("div", { className: "backdrop" }), (0, _preact.h)(
	                    "div",
	                    { className: "detail" },
	                    (0, _preact.h)("a", { className: "close-btn", "aria-label": "Close", onClick: this.hideInfo }),
	                    (0, _preact.h)(
	                        "div",
	                        { className: "info" },
	                        (0, _preact.h)(
	                            "ul",
	                            { className: "basic" },
	                            (0, _preact.h)(
	                                "li",
	                                null,
	                                "\u7528\u6237\u540D\uFF1A",
	                                baseInfo.username
	                            ),
	                            (0, _preact.h)(
	                                "li",
	                                null,
	                                "\u6635\u79F0\uFF1A",
	                                baseInfo.nickname
	                            ),
	                            (0, _preact.h)(
	                                "li",
	                                null,
	                                "\u90AE\u7BB1\uFF1A",
	                                baseInfo.email
	                            )
	                        )
	                    ),
	                    (0, _preact.h)(Messages, { value: messageIds,
	                        load: this.loadMessageIds,
	                        onRemoveMessage: this.handleRemoveMessage })
	                )];
	            }
	            return (0, _preact.h)(
	                "div",
	                { className: "userinfo" },
	                (0, _preact.h)(
	                    "div",
	                    { className: "mid welcome" },
	                    "\u6B22\u8FCE\uFF0C",
	                    (0, _preact.h)(
	                        "a",
	                        { href: "javascript:", onClick: this.showInfo, className: "detail-btn" },
	                        baseInfo.nickname
	                    ),
	                    (0, _preact.h)(
	                        "a",
	                        { href: "javascript:", onClick: this.logout, className: "logout-btn" },
	                        "[\u9000\u51FA]"
	                    )
	                ),
	                detail
	            );
	        }
	    }]);

	    return User;
	}(_preact.Component);

	exports.default = User;

/***/ },

/***/ 337:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _preact = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Jumbotron = function (_Component) {
	    _inherits(Jumbotron, _Component);

	    function Jumbotron() {
	        _classCallCheck(this, Jumbotron);

	        return _possibleConstructorReturn(this, (Jumbotron.__proto__ || Object.getPrototypeOf(Jumbotron)).apply(this, arguments));
	    }

	    _createClass(Jumbotron, [{
	        key: "render",
	        value: function render() {
	            return (0, _preact.h)(
	                "div",
	                { className: "jumbotron" },
	                (0, _preact.h)(
	                    "div",
	                    { className: "mid" },
	                    (0, _preact.h)(
	                        "div",
	                        { className: "logo" },
	                        (0, _preact.h)(
	                            "span",
	                            { className: "name" },
	                            "Awhile"
	                        ),
	                        (0, _preact.h)(
	                            "span",
	                            { className: "dot" },
	                            "."
	                        ),
	                        (0, _preact.h)(
	                            "span",
	                            { className: "domain" },
	                            "Online"
	                        )
	                    )
	                )
	            );
	        }
	    }]);

	    return Jumbotron;
	}(_preact.Component);

	exports.default = Jumbotron;

/***/ },

/***/ 338:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _preact = __webpack_require__(1);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Nav = function (_Component) {
	    _inherits(Nav, _Component);

	    function Nav() {
	        _classCallCheck(this, Nav);

	        return _possibleConstructorReturn(this, (Nav.__proto__ || Object.getPrototypeOf(Nav)).apply(this, arguments));
	    }

	    _createClass(Nav, [{
	        key: "render",
	        value: function render() {
	            var value = this.props.value;

	            var children = value.map(function (_ref, idx) {
	                var name = _ref.name,
	                    value = _ref.value;

	                if (value) {
	                    return (0, _preact.h)(
	                        "a",
	                        { key: idx, href: value },
	                        name
	                    );
	                } else {
	                    return (0, _preact.h)(
	                        "span",
	                        { key: idx },
	                        name
	                    );
	                }
	            });
	            return (0, _preact.h)(
	                "div",
	                { className: "nav" },
	                children
	            );
	        }
	    }]);

	    return Nav;
	}(_preact.Component);

	exports.default = Nav;

/***/ },

/***/ 339:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _preact = __webpack_require__(1);

	var _moment = __webpack_require__(340);

	var _moment2 = _interopRequireDefault(_moment);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var isSupportTouch = "ontouchstart" in window;

	var FORMATTER = "YYYY-MM-DD HH:mm:ss";

	function debounce(func) {
	    var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000 / 60;

	    var now = Date.now();
	    return function _debounce_() {
	        if (Date.now() - now < interval) {
	            return;
	        }
	        func.apply(undefined, arguments);
	        now = Date.now();
	    };
	}

	var Track = function (_Component) {
	    _inherits(Track, _Component);

	    function Track() {
	        var _ref;

	        _classCallCheck(this, Track);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        var _this = _possibleConstructorReturn(this, (_ref = Track.__proto__ || Object.getPrototypeOf(Track)).call.apply(_ref, [this].concat(args)));

	        _this.state = {
	            activeCls: ""
	        };

	        _this.handleMouseDown = _this.handleMouseDown.bind(_this);
	        _this.handleMouseMove = _this.handleMouseMove.bind(_this);
	        _this.handleMouseUp = _this.handleMouseUp.bind(_this);
	        _this.move = debounce(_this.move.bind(_this), 16);
	        return _this;
	    }

	    _createClass(Track, [{
	        key: "getXFrom",
	        value: function getXFrom(evt) {
	            if (isSupportTouch) {
	                return evt.changedTouches[0].clientX;
	            } else {
	                return evt.clientX;
	            }
	        }
	    }, {
	        key: "handleMouseDown",
	        value: function handleMouseDown(evt) {
	            var target = evt.target;
	            this.x = this.getXFrom(evt);

	            var _target$getBoundingCl = target.getBoundingClientRect(),
	                left = _target$getBoundingCl.left,
	                width = _target$getBoundingCl.width;

	            this.containerWidth = target.parentNode.getBoundingClientRect().width;
	            var offsetX = this.x - left;
	            if (offsetX >= width - 6) {
	                this.movingParts = "end";
	                this.setState({
	                    activeCls: "end"
	                });
	            } else if (offsetX <= 6) {
	                if (this.props.fixedStart) return;
	                this.movingParts = "start";
	                this.setState({
	                    activeCls: "start"
	                });
	            } else {
	                if (this.props.fixedStart) return;
	                this.movingParts = "whole";
	                this.setState({
	                    activeCls: "whole"
	                });
	                document.body.style.cursor = "grabbing";
	            }
	            if (isSupportTouch) {
	                document.addEventListener("touchmove", this.handleMouseMove, false);
	                document.addEventListener("touchend", this.handleMouseUp, false);
	                document.addEventListener("touchcancel", this.handleMouseUp, false);
	            } else {
	                document.addEventListener("mousemove", this.handleMouseMove, false);
	                document.addEventListener("mouseup", this.handleMouseUp, false);
	            }
	        }
	    }, {
	        key: "handleMouseMove",
	        value: function handleMouseMove(evt) {
	            this.tryToMove(evt);
	        }
	    }, {
	        key: "handleMouseUp",
	        value: function handleMouseUp(evt) {
	            if (isSupportTouch) {
	                document.removeEventListener("touchmove", this.handleMouseMove, false);
	                document.removeEventListener("touchend", this.handleMouseUp, false);
	                document.removeEventListener("touchcancel", this.handleMouseUp, false);
	            } else {
	                document.removeEventListener("mousemove", this.handleMouseMove, false);
	                document.removeEventListener("mouseup", this.handleMouseUp, false);
	            }
	            this.tryToMove(evt);
	            this.movingParts = "";
	            this.x = null;
	            this.containerWidth = null;
	            document.body.style.cursor = "";
	            this.setState({
	                activeCls: ""
	            });
	        }
	    }, {
	        key: "tryToMove",
	        value: function tryToMove(evt) {
	            var _this2 = this;

	            var x = this.getXFrom(evt);
	            this.deltaX = x - this.x;
	            this.move(function () {
	                return _this2.x = x, _this2.deltaX = 0;
	            });
	        }
	    }, {
	        key: "move",
	        value: function move(callback) {
	            var deltaX = this.deltaX;
	            if (!this.deltaX) return;
	            var _props = this.props,
	                start = _props.start,
	                end = _props.end,
	                value = _props.value;

	            var length = end - start;
	            var ratio = deltaX / this.containerWidth;
	            if (ratio > 1) {
	                ratio = 1;
	            } else if (ratio < -1) {
	                ratio = -1;
	            }
	            var startTime = void 0,
	                endTime = void 0;
	            var safeWidth = 0 / this.containerWidth * length;
	            var offsetTime = ratio * length;
	            switch (this.movingParts) {
	                case "start":
	                    startTime = Math.max(start, value.startTime + offsetTime);
	                    if (value.endTime - startTime < safeWidth) {
	                        startTime = Math.max(start, value.endTime - safeWidth);
	                    }
	                    this.props.onChange({
	                        startTime: startTime,
	                        endTime: value.endTime
	                    });
	                    break;
	                case "end":
	                    endTime = Math.min(value.endTime + offsetTime, end);
	                    if (endTime - value.startTime < safeWidth) {
	                        endTime = Math.min(value.startTime + safeWidth, end);
	                    }
	                    this.props.onChange({
	                        startTime: value.startTime,
	                        endTime: endTime
	                    });
	                    break;
	                case "whole":
	                    startTime = value.startTime + offsetTime;
	                    endTime = value.endTime + offsetTime;
	                    if (startTime < start) {
	                        startTime = start;
	                        endTime = startTime + (value.endTime - value.startTime);
	                    }
	                    if (endTime > end) {
	                        endTime = end;
	                        startTime = endTime - (value.endTime - value.startTime);
	                    }
	                    this.props.onChange({
	                        startTime: startTime,
	                        endTime: endTime
	                    });
	                    break;
	                default:
	                    return;
	            }
	            callback();
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _props2 = this.props,
	                start = _props2.start,
	                end = _props2.end,
	                value = _props2.value,
	                fixedStart = _props2.fixedStart;
	            var activeCls = this.state.activeCls;

	            var length = end - start;
	            var x = (value.startTime - start) / length * 100;
	            var w = (value.endTime - value.startTime) / length * 100;
	            var styl = {
	                width: w.toFixed(6) + "%",
	                left: x.toFixed(6) + "%"
	            };
	            var cls = activeCls + " " + (fixedStart ? "fixed-start" : "");
	            if (isSupportTouch) {
	                return (0, _preact.h)("span", { className: "track " + cls, style: styl,
	                    onTouchStart: this.handleMouseDown });
	            } else {
	                return (0, _preact.h)("span", { className: "track " + cls, style: styl,
	                    onMouseDown: this.handleMouseDown });
	            }
	        }
	    }]);

	    return Track;
	}(_preact.Component);

	var TimeRange = function (_Component2) {
	    _inherits(TimeRange, _Component2);

	    function TimeRange() {
	        var _ref2;

	        _classCallCheck(this, TimeRange);

	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	        }

	        var _this3 = _possibleConstructorReturn(this, (_ref2 = TimeRange.__proto__ || Object.getPrototypeOf(TimeRange)).call.apply(_ref2, [this].concat(args)));

	        _this3.handleStartTimeChange = _this3.handleStartTimeChange.bind(_this3);
	        _this3.handleEndTimeChange = _this3.handleEndTimeChange.bind(_this3);
	        return _this3;
	    }

	    _createClass(TimeRange, [{
	        key: "timeToString",
	        value: function timeToString(t) {
	            return _moment2.default.unix(t).format(FORMATTER);
	        }
	    }, {
	        key: "parseStringTime",
	        value: function parseStringTime(str) {
	            var m = (0, _moment2.default)(str, FORMATTER, false);
	            if (m.isValid()) {
	                return m.unix();
	            } else {
	                throw new Error(str + " is not valid time string");
	            }
	        }
	    }, {
	        key: "handleStartTimeChange",
	        value: function handleStartTimeChange(evt) {
	            var target = evt.target;
	            var value = target.value;
	            var _props3 = this.props,
	                start = _props3.start,
	                end = _props3.end,
	                range = _props3.value,
	                fixedStart = _props3.fixedStart;

	            if (fixedStart) return;
	            try {
	                var startTime = Math.min(Math.max(start, this.parseStringTime(value)), range.endTime - (end - start) * 0.01);
	                this.props.onChange(Object.assign({}, range, {
	                    startTime: startTime
	                }));
	            } catch (ex) {
	                // empty
	            }
	        }
	    }, {
	        key: "handleEndTimeChange",
	        value: function handleEndTimeChange(evt) {
	            var target = evt.target;
	            var value = target.value;
	            var _props4 = this.props,
	                start = _props4.start,
	                end = _props4.end,
	                range = _props4.value;

	            try {
	                var endTime = Math.max(range.startTime + (end - start) * 0.01, Math.min(this.parseStringTime(value), end));
	                this.props.onChange(Object.assign({}, range, {
	                    endTime: endTime
	                }));
	            } catch (ex) {
	                // empty
	            }
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _props5 = this.props,
	                range = _props5.value,
	                start = _props5.start,
	                end = _props5.end,
	                onChange = _props5.onChange,
	                fixedStart = _props5.fixedStart;

	            var startTimeString = this.timeToString(range.startTime);
	            var endTimeString = this.timeToString(range.endTime);
	            return (0, _preact.h)(
	                "div",
	                { className: "time-range-container" },
	                (0, _preact.h)(
	                    "div",
	                    { className: "range-ipt" },
	                    (0, _preact.h)("input", { type: "text", value: startTimeString,
	                        disabled: fixedStart,
	                        onChange: this.handleStartTimeChange }),
	                    "-",
	                    (0, _preact.h)("input", {
	                        type: "text", value: endTimeString, onChange: this.handleEndTimeChange })
	                ),
	                (0, _preact.h)(
	                    "div",
	                    { className: "range",
	                        "data-start-time": this.timeToString(start),
	                        "data-end-time": this.timeToString(end) },
	                    (0, _preact.h)(Track, { start: start, end: end, value: range, onChange: onChange, fixedStart: fixedStart })
	                )
	            );
	        }
	    }]);

	    return TimeRange;
	}(_preact.Component);

	exports.default = TimeRange;

/***/ },

/***/ 450:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	// Ref: https://github.com/zpao/qrcode.react/blob/master/src/index.js

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _utils = __webpack_require__(328);

	var _preact = __webpack_require__(1);

	var _QRCode = __webpack_require__(451);

	var _QRCode2 = _interopRequireDefault(_QRCode);

	var _ErrorCorrectLevel = __webpack_require__(455);

	var _ErrorCorrectLevel2 = _interopRequireDefault(_ErrorCorrectLevel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// qr.js doesn't handle error level of zero (M) so we need to do it right,
	// thus the deep require.


	function getBackingStorePixelRatio(ctx) {
	    return ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
	}

	var QRCode = function (_Component) {
	    _inherits(QRCode, _Component);

	    function QRCode() {
	        _classCallCheck(this, QRCode);

	        return _possibleConstructorReturn(this, (QRCode.__proto__ || Object.getPrototypeOf(QRCode)).apply(this, arguments));
	    }

	    _createClass(QRCode, [{
	        key: "shouldComponentUpdate",
	        value: function shouldComponentUpdate(nextProps) {
	            if ((0, _utils.isObjectEqual)(nextProps, this.props)) {
	                return false;
	            }
	        }
	    }, {
	        key: "componentDidMount",
	        value: function componentDidMount() {
	            this.update();
	        }
	    }, {
	        key: "componentDidUpdate",
	        value: function componentDidUpdate() {
	            this.update();
	        }
	    }, {
	        key: "update",
	        value: function update() {
	            var _props = this.props,
	                value = _props.value,
	                size = _props.size,
	                level = _props.level,
	                bgColor = _props.bgColor,
	                fgColor = _props.fgColor;

	            // We'll use type===-1 to force QRCode to automatically pick the best type

	            var qrcode = new _QRCode2.default(-1, _ErrorCorrectLevel2.default[level]);
	            qrcode.addData(value);
	            qrcode.make();

	            var canvas = this._canvas;

	            var ctx = canvas.getContext("2d");
	            var cells = qrcode.modules;
	            var tileW = size / cells.length;
	            var tileH = size / cells.length;
	            var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
	            canvas.height = canvas.width = size * scale;
	            ctx.scale(scale, scale);

	            cells.forEach(function (row, rdx) {
	                row.forEach(function (cell, cdx) {
	                    ctx.fillStyle = cell ? fgColor : bgColor;
	                    var w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
	                    var h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
	                    ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
	                });
	            });
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _this2 = this;

	            var size = this.props.size;

	            return (0, _preact.h)("canvas", {
	                style: {
	                    width: size,
	                    height: size
	                },
	                width: size, height: size, ref: function ref(el) {
	                    return _this2._canvas = el;
	                } });
	        }
	    }]);

	    return QRCode;
	}(_preact.Component);

	exports.default = QRCode;


	QRCode.defaultProps = {
	    size: 128,
	    level: "L",
	    bgColor: "#FFFFFF",
	    fgColor: "#000000"
	};

/***/ },

/***/ 460:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _moment = __webpack_require__(340);

	var _moment2 = _interopRequireDefault(_moment);

	var _preact = __webpack_require__(1);

	var _components = __webpack_require__(335);

	var _utils = __webpack_require__(328);

	var _constants = __webpack_require__(23);

	var _actions = __webpack_require__(326);

	var actions = _interopRequireWildcard(_actions);

	var _validate = __webpack_require__(461);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ERROR_MESSAGES = {
	    content: {
	        typeMismatch: "格式不对",
	        tooShort: "内容不能为空",
	        tooLong: "内容已超过 1024 个字符"
	    }
	};

	var PostedSuccess = function (_Component) {
	    _inherits(PostedSuccess, _Component);

	    function PostedSuccess() {
	        var _ref;

	        _classCallCheck(this, PostedSuccess);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        var _this = _possibleConstructorReturn(this, (_ref = PostedSuccess.__proto__ || Object.getPrototypeOf(PostedSuccess)).call.apply(_ref, [this].concat(args)));

	        _this.state = {
	            coping: false
	        };
	        _this.doCopy = _this.doCopy.bind(_this);
	        return _this;
	    }

	    _createClass(PostedSuccess, [{
	        key: "doCopy",
	        value: function doCopy() {
	            var _this2 = this;

	            this.setState({
	                coping: true
	            });
	            if ("clipboardData" in window) {
	                window.clipboardData.setData("Text", this.props.link);
	                this.setState({
	                    coping: false
	                });
	                return;
	            }
	            var handleEvent = function handleEvent(evt) {
	                document.removeEventListener("copy", handleEvent, true);
	                evt.preventDefault();
	                evt.clipboardData.setData("text/plain", _this2.props.link);
	                _this2.setState({
	                    coping: false
	                });
	            };
	            document.addEventListener("copy", handleEvent, true);
	            document.execCommand("copy");
	        }
	    }, {
	        key: "componentDidUnmount",
	        value: function componentDidUnmount() {
	            this.props.dispatch(actions.resetPublishState());
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _props = this.props,
	                link = _props.link,
	                coping = _props.coping;

	            return (0, _preact.h)(
	                "div",
	                { className: "posted-message-container" },
	                (0, _preact.h)(
	                    "h2",
	                    null,
	                    "\u53D1\u5E03\u6210\u529F\uFF01"
	                ),
	                (0, _preact.h)(
	                    "div",
	                    { className: "message-link-text" },
	                    (0, _preact.h)(
	                        "a",
	                        { href: link, target: "_blank" },
	                        link
	                    ),
	                    (0, _preact.h)(
	                        "a",
	                        { className: "copy-btn " + (coping ? "copying" : ""),
	                            onClick: this.doCopy },
	                        "\u590D\u5236"
	                    )
	                ),
	                (0, _preact.h)(
	                    "div",
	                    { className: "qrcode" },
	                    (0, _preact.h)(_components.QRCode, { value: link, size: 150 })
	                )
	            );
	        }
	    }]);

	    return PostedSuccess;
	}(_preact.Component);

	var PostMessage = function (_Component2) {
	    _inherits(PostMessage, _Component2);

	    function PostMessage() {
	        var _ref2;

	        _classCallCheck(this, PostMessage);

	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	        }

	        var _this3 = _possibleConstructorReturn(this, (_ref2 = PostMessage.__proto__ || Object.getPrototypeOf(PostMessage)).call.apply(_ref2, [this].concat(args)));

	        var _this3$getTimeRanges = _this3.getTimeRanges(),
	            startTime = _this3$getTimeRanges.startTime,
	            endTime = _this3$getTimeRanges.endTime,
	            range = _this3$getTimeRanges.range;

	        _this3.state = {
	            posting: false,
	            errorMessage: "",
	            characterCount: _constants.MAX_MESSAGE_CONTENT_LENGTH,
	            startTime: startTime,
	            endTime: endTime,
	            range: range
	        };
	        setTimeout(function () {
	            _this3.updateStateFrom(_this3.props);
	        });
	        _this3.handleSubmit = _this3.handleSubmit.bind(_this3);
	        _this3.calcRemainingCharacterCount = _this3.calcRemainingCharacterCount.bind(_this3);
	        _this3.handleFocus = _this3.handleFocus.bind(_this3);
	        _this3.handleBlur = _this3.handleBlur.bind(_this3);
	        _this3.handleTimeRangeChange = _this3.handleTimeRangeChange.bind(_this3);
	        return _this3;
	    }

	    _createClass(PostMessage, [{
	        key: "componentDidMount",
	        value: function componentDidMount() {
	            if (this._textAreaEl) {
	                this._textAreaEl.value = "";
	            }
	        }
	    }, {
	        key: "componentWillReceiveProps",
	        value: function componentWillReceiveProps(nextProps) {
	            if (!(0, _utils.isObjectEqual)(nextProps, this.props)) {
	                this.updateStateFrom(nextProps);
	            }
	        }
	    }, {
	        key: "getTimeRanges",
	        value: function getTimeRanges() {
	            var now = Math.floor(Date.now() / 1000);
	            var startTime = now;
	            var endTime = now + (this.props.isLoggedIn ? _moment2.default.duration(1, "months") : _moment2.default.duration(5, "days")).asSeconds();
	            return {
	                startTime: startTime,
	                endTime: endTime,
	                range: {
	                    startTime: startTime,
	                    endTime: startTime + _moment2.default.duration(1, "hours").asSeconds()
	                }
	            };
	        }
	    }, {
	        key: "normalizeErrorMessage",
	        value: function normalizeErrorMessage(messages) {
	            if (!messages) {
	                return messages;
	            } else if (typeof messages === "string") {
	                return messages;
	            } else if (Array.isArray(messages)) {
	                return messages.join("; ");
	            } else if ((typeof messages === "undefined" ? "undefined" : _typeof(messages)) === "object") {
	                var keys = Object.keys(messages);
	                return keys.map(function (key) {
	                    return messages[key];
	                }).join("; ");
	            }
	        }
	    }, {
	        key: "updateStateFrom",
	        value: function updateStateFrom(props) {
	            var errorMessage = void 0;
	            if (props.error) {
	                if (props.error.detail) {
	                    errorMessage = this.normalizeErrorMessage((0, _validate.mapValidityStatesToMessages)(props.error.detail, ERROR_MESSAGES));
	                } else {
	                    errorMessage = props.error.message;
	                }
	            }
	            this.setState({
	                posting: props.posting,
	                errorMessage: errorMessage
	            });
	        }
	    }, {
	        key: "handleSubmit",
	        value: function handleSubmit(evt) {
	            evt.preventDefault();
	            var el = this._textAreaEl;
	            var content = el.value;
	            var _state$range = this.state.range,
	                startTime = _state$range.startTime,
	                endTime = _state$range.endTime;

	            var ttl = endTime - startTime;
	            var result = (0, _validate.validateMessage)({
	                content: content,
	                startTime: startTime,
	                ttl: ttl
	            });
	            if (result !== true) {
	                var errorMessage = this.normalizeErrorMessage((0, _validate.mapValidityStatesToMessages)(result, ERROR_MESSAGES));
	                this.setState({
	                    errorMessage: errorMessage
	                });
	            } else {
	                this.props.dispatch(actions.postMessage(content, startTime, ttl));
	            }
	        }
	    }, {
	        key: "calcRemainingCharacterCount",
	        value: function calcRemainingCharacterCount() {
	            var el = this._textAreaEl;
	            if (!el) return;
	            var remainingCount = _constants.MAX_MESSAGE_CONTENT_LENGTH - el.value.length;
	            if (remainingCount == this.state.characterCount) {
	                return;
	            }
	            this.setState({
	                characterCount: remainingCount
	            });
	        }
	    }, {
	        key: "handleFocus",
	        value: function handleFocus() {
	            if (this._intervalId) {
	                clearInterval(this._intervalId);
	            }
	            this._intervalId = setInterval(this.calcRemainingCharacterCount, 100);
	        }
	    }, {
	        key: "handleBlur",
	        value: function handleBlur() {
	            clearInterval(this._intervalId);
	            delete this._intervalId;
	            this.calcRemainingCharacterCount();
	        }
	    }, {
	        key: "handleTimeRangeChange",
	        value: function handleTimeRangeChange(value) {
	            this.setState({
	                range: value
	            });
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _this4 = this;

	            var _state = this.state,
	                posting = _state.posting,
	                errorMessage = _state.errorMessage,
	                characterCount = _state.characterCount,
	                startTime = _state.startTime,
	                endTime = _state.endTime,
	                range = _state.range;

	            var submitCls = posting ? "submiting btn--pending" : "";
	            return (0, _preact.h)(
	                "div",
	                { className: "post-message-container" },
	                (0, _preact.h)(
	                    "form",
	                    { onSubmit: this.handleSubmit, name: "publish-form" },
	                    (0, _preact.h)(
	                        "div",
	                        { className: "content" },
	                        (0, _preact.h)("textarea", { ref: function ref(el) {
	                                return _this4._textAreaEl = el;
	                            },
	                            onFocus: this.handleFocus,
	                            onBlur: this.handleBlur,
	                            placeholder: "\u5728\u6B64\u8F93\u5165\u60A8\u9700\u8981\u53D1\u5E03\u7684\u6D88\u606F\u2026\u2026" }),
	                        (0, _preact.h)(
	                            "span",
	                            { className: "character-remaining " + (characterCount < 0 ? "warning" : "") },
	                            characterCount
	                        )
	                    ),
	                    (0, _preact.h)(
	                        "div",
	                        { className: "metadata-container" },
	                        (0, _preact.h)(
	                            "div",
	                            { className: "label" },
	                            "\u8BBE\u7F6E\u751F\u6548\u65F6\u95F4\uFF1A"
	                        ),
	                        (0, _preact.h)(_components.TimeRange, { start: startTime, end: endTime, value: range,
	                            fixedStart: !this.props.isLoggedIn,
	                            onChange: this.handleTimeRangeChange })
	                    ),
	                    errorMessage && (0, _preact.h)(
	                        "div",
	                        { className: "form-ctl" },
	                        (0, _preact.h)(
	                            "div",
	                            { className: "tips invalid" },
	                            errorMessage
	                        )
	                    ),
	                    (0, _preact.h)(
	                        "div",
	                        { className: "btn-container" },
	                        (0, _preact.h)(
	                            "button",
	                            { type: "submit", disabled: characterCount < 0,
	                                className: "btn btn-primary " + submitCls },
	                            "\u53D1\u5E03"
	                        )
	                    )
	                )
	            );
	        }
	    }]);

	    return PostMessage;
	}(_preact.Component);

	exports.default = function (_ref3) {
	    var userInfo = _ref3.userInfo,
	        dispatch = _ref3.dispatch,
	        message = _ref3.message;
	    return (0, _preact.h)(
	        "div",
	        null,
	        (0, _preact.h)(_components.User, _extends({}, userInfo, { dispatch: dispatch })),
	        (0, _preact.h)(_components.Jumbotron, null),
	        (0, _preact.h)(
	            "div",
	            { className: "mid" },
	            (0, _preact.h)(
	                "div",
	                { className: "main" },
	                (0, _preact.h)(_components.Nav, { value: [{ name: "首页", value: "/" }, { name: "发布", value: null }] }),
	                message.link ? (0, _preact.h)(PostedSuccess, { link: message.link, dispatch: dispatch }) : (0, _preact.h)(PostMessage, { isLoggedIn: !!userInfo.baseInfo, error: message.error, posting: message.posting, dispatch: dispatch })
	            )
	        )
	    );
	};

/***/ },

/***/ 461:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.validateRegister = validateRegister;
	exports.validateMessage = validateMessage;
	exports.generateValidationMessage = generateValidationMessage;
	exports.mapValidityStatesToMessages = mapValidityStatesToMessages;

	var _validator = __webpack_require__(462);

	var _validator2 = _interopRequireDefault(_validator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @typedef {Object} ValidityState
	 * @property {boolean} valueMissing
	 * @property {boolean} typeMismatch
	 * @property {boolean} patternMismatch
	 * @property {boolean} tooLong
	 * @property {boolean} tooShort
	 * @property {boolean} rangeUnderflow
	 * @property {boolean} rangeOverflow
	 * @property {boolean} stepMismatch
	 * @property {boolean} badInput
	 * @property {boolean} customError
	 * @property {boolean} valid
	 */

	function checkLength(str, min, max) {
	    var validity = {
	        valid: true
	    };
	    if (str == null || _validator2.default.isEmpty(str)) {
	        validity.valid = false;
	        validity.valueMissing = true;
	    } else if (!_validator2.default.isLength(str, { min: min })) {
	        validity.valid = false;
	        validity.tooShort = true;
	    } else if (!_validator2.default.isLength(str, { max: max })) {
	        validity.valid = false;
	        validity.tooLong = true;
	    }
	    return validity;
	}
	function checkEmail(email) {
	    var validity = {
	        valid: true
	    };
	    // NOTE: email is optional
	    if (email == null || email == "") {
	        return validity;
	    }
	    if (!_validator2.default.isEmail(email)) {
	        validity.valid = false;
	        validity.typeMismatch = true;
	    }
	    return validity;
	}

	function validateRegister(params) {
	    var validities = {};
	    validities.username = checkLength(params.username, 3, 32);
	    validities.password = checkLength(params.password, 6, 128);
	    validities.email = checkEmail(params.email);
	    if (validities.username.valid && validities.password.valid && validities.email.valid) {
	        return true;
	    } else {
	        return validities;
	    }
	}

	function validateMessage(_ref) {
	    var content = _ref.content;

	    var validities = {};
	    if (typeof content !== "string") {
	        validities.content = {
	            valid: false,
	            typeMismatch: true
	        };
	    } else if (content.length === 0) {
	        validities.content = {
	            valid: false,
	            tooShort: true
	        };
	    } else if (content.length > 1024) {
	        validities.content = {
	            valid: false,
	            tooLong: true
	        };
	    }
	    if (Object.keys(validities).length === 0) {
	        return true;
	    } else {
	        return validities;
	    }
	}

	/**
	 * @param {ValidityState}
	 * @param {Object} validationMessages - map validityState to error message
	 * @param {string} [separator="; "]
	 * @return {string}
	 */
	function generateValidationMessage(validityState, validationMessage) {
	    var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "; ";

	    if (validityState.valid) {
	        return "";
	    }
	    if (validityState.customError) {
	        return validityState.customErrorMessage;
	    }
	    var messages = [];
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        for (var _iterator = Object.keys(validityState)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var key = _step.value;

	            if (key === "valid" || key === "customError" || key === "customErrorMessage") {
	                continue;
	            }
	            messages.push(validationMessage[key]);
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }

	    return messages.join(separator);
	}

	function mapValidityStatesToMessages(states, messages) {
	    var keys = Object.keys(states);
	    return keys.reduce(function (mapped, key) {
	        mapped[key] = generateValidationMessage(states[key], messages[key]);
	        return mapped;
	    }, {});
	}

/***/ },

/***/ 527:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _preact = __webpack_require__(1);

	var _actions = __webpack_require__(326);

	var actions = _interopRequireWildcard(_actions);

	var _components = __webpack_require__(335);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LoginForm = function LoginForm(_ref) {
	    var errorMessage = _ref.errorMessage,
	        processing = _ref.processing,
	        onSubmit = _ref.onSubmit;

	    var tips = void 0,
	        submitCls = "";
	    if (processing) {
	        submitCls = "processing btn--pending";
	    } else if (errorMessage) {
	        var content = Array.isArray(errorMessage) ? errorMessage.map(function (msg, idx) {
	            return (0, _preact.h)(
	                "p",
	                { key: idx, className: "tips invalid" },
	                msg
	            );
	        }) : (0, _preact.h)(
	            "p",
	            { "class": "tips invalid" },
	            errorMessage
	        );
	        tips = (0, _preact.h)(
	            "div",
	            { className: "form-ctl" },
	            content
	        );
	    }
	    return (0, _preact.h)(
	        "form",
	        { onSubmit: onSubmit, name: "login-form" },
	        (0, _preact.h)(
	            "div",
	            { className: "form-ctl" },
	            (0, _preact.h)(
	                "label",
	                { className: "for-text" },
	                "\u7528\u6237\u540D"
	            ),
	            (0, _preact.h)("input", { type: "text", name: "username", required: true })
	        ),
	        (0, _preact.h)(
	            "div",
	            { className: "form-ctl" },
	            (0, _preact.h)(
	                "label",
	                { className: "for-text" },
	                "\u5BC6\u7801"
	            ),
	            (0, _preact.h)("input", { type: "password", name: "password", required: true })
	        ),
	        (0, _preact.h)(
	            "div",
	            { className: "form-ctl" },
	            (0, _preact.h)(
	                "label",
	                { className: "for-checkbox" },
	                (0, _preact.h)(
	                    "span",
	                    { className: "checkbox-wrapper" },
	                    (0, _preact.h)("input", { type: "checkbox", name: "rememberMe", value: "true" }),
	                    (0, _preact.h)(
	                        "i",
	                        null,
	                        "\u2713"
	                    )
	                ),
	                "\u8BB0\u4F4F\u767B\u5F55\u72B6\u6001"
	            )
	        ),
	        tips,
	        (0, _preact.h)(
	            "div",
	            { className: "form-ctl" },
	            (0, _preact.h)(
	                "button",
	                { type: "submit",
	                    className: ("btn btn-block btn-primary " + submitCls).trim() },
	                "\u767B\u5F55"
	            )
	        )
	    );
	};

	var LoginSuccessDialog = function LoginSuccessDialog() {
	    return (0, _preact.h)(
	        "div",
	        { className: "login-success-dialog" },
	        (0, _preact.h)(
	            "h2",
	            null,
	            "\u767B\u5F55\u6210\u529F"
	        ),
	        (0, _preact.h)(
	            "a",
	            { "class": "btn btn-block btn-primary", href: "/publish.html" },
	            "\u53D1\u5E03\u6D88\u606F"
	        )
	    );
	};

	var Login = function (_Component) {
	    _inherits(Login, _Component);

	    function Login() {
	        var _ref2;

	        _classCallCheck(this, Login);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        var _this = _possibleConstructorReturn(this, (_ref2 = Login.__proto__ || Object.getPrototypeOf(Login)).call.apply(_ref2, [this].concat(args)));

	        _this.handleSubmit = _this.handleSubmit.bind(_this);
	        _this.state = {
	            loggedIn: false,
	            errorMessage: "",
	            processing: false
	        };
	        setTimeout(_this.updateState.bind(_this, _this.props.auth));
	        return _this;
	    }

	    _createClass(Login, [{
	        key: "updateState",
	        value: function updateState(auth) {
	            var _this2 = this;

	            if (auth.processing) {
	                this.setState({
	                    processing: true,
	                    errorMessage: "",
	                    loggedIn: false
	                });
	            } else if (auth.success) {
	                this.setState({
	                    processing: false,
	                    errorMessage: "",
	                    loggedIn: true
	                }, function () {
	                    _this2.props.dispatch(actions.getUserInfo());
	                });
	            } else if (auth.error) {
	                this.setState({
	                    processing: false,
	                    errorMessage: auth.error.message,
	                    loggedIn: false
	                });
	            } else {
	                // reset
	                this.setState({
	                    processing: false,
	                    errorMessage: "",
	                    loggedIn: false
	                });
	            }
	        }
	    }, {
	        key: "componentWillReceiveProps",
	        value: function componentWillReceiveProps(nextProps) {
	            if (nextProps.auth !== this.props.auth) {
	                this.updateState(nextProps.auth);
	            }
	        }
	    }, {
	        key: "handleSubmit",
	        value: function handleSubmit(evt) {
	            evt.preventDefault();
	            var formEl = evt.target;
	            var usernameEl = formEl["username"];
	            var passwordEl = formEl["password"];
	            var rememberEl = formEl["rememberMe"];
	            var errorMessages = [];
	            var username = usernameEl.value;
	            var password = passwordEl.value;
	            var isRemember = rememberEl.checked;
	            if (usernameEl.value.length < 3) {
	                errorMessages.push("用户名太短了");
	            } else if (usernameEl.value.length > 32) {
	                errorMessages.push("用户名太长了");
	            }
	            if (passwordEl.value.length === "0") {
	                errorMessages.push("密码不能为空");
	            }
	            if (errorMessages.length) {
	                this.setState({
	                    errorMessage: errorMessages
	                });
	            } else {
	                this.props.dispatch(actions.login(username, password, isRemember));
	            }
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _props = this.props,
	                userInfo = _props.userInfo,
	                dispatch = _props.dispatch;
	            var _state = this.state,
	                errorMessage = _state.errorMessage,
	                loggedIn = _state.loggedIn,
	                processing = _state.processing;

	            return (0, _preact.h)(
	                "div",
	                null,
	                (0, _preact.h)(_components.User, _extends({}, userInfo, { dispatch: dispatch })),
	                (0, _preact.h)(_components.Jumbotron, null),
	                (0, _preact.h)(
	                    "div",
	                    { className: "mid" },
	                    (0, _preact.h)(
	                        "div",
	                        { className: "main" },
	                        (0, _preact.h)(_components.Nav, { value: [{ name: "首页", value: "/" }, { name: "登录", value: null }] }),
	                        (0, _preact.h)(
	                            "div",
	                            { className: "login-container" },
	                            loggedIn ? (0, _preact.h)(LoginSuccessDialog, null) : (0, _preact.h)(LoginForm, { errorMessage: errorMessage,
	                                processing: processing,
	                                onSubmit: this.handleSubmit })
	                        )
	                    )
	                )
	            );
	        }
	    }]);

	    return Login;
	}(_preact.Component);

	exports.default = Login;

/***/ },

/***/ 528:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _preact = __webpack_require__(1);

	var _components = __webpack_require__(335);

	var _actions = __webpack_require__(326);

	var actions = _interopRequireWildcard(_actions);

	var _validate = __webpack_require__(461);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ERROR_MESSAGES = {
	    username: {
	        valueMismatch: "用户名不能为空",
	        tooShort: "用户名长度必须至少 3 个字符",
	        tooLong: "用户名长度不能超过 32 个字符"
	    },
	    password: {
	        tooShort: "密码长度至少 6 个字符",
	        tooLong: "密码长度太长了",
	        valueMismatch: "密码不能为空"
	    },
	    email: {
	        typeMismatch: "Email 格式不对"
	    }
	};

	var RegisterForm = function (_Component) {
	    _inherits(RegisterForm, _Component);

	    function RegisterForm() {
	        var _ref;

	        _classCallCheck(this, RegisterForm);

	        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	            args[_key] = arguments[_key];
	        }

	        var _this = _possibleConstructorReturn(this, (_ref = RegisterForm.__proto__ || Object.getPrototypeOf(RegisterForm)).call.apply(_ref, [this].concat(args)));

	        _this.state = {
	            passwordViewer: false,
	            usernameValidityMessage: undefined,
	            passwordValidityMessage: undefined,
	            emailValidityMessage: undefined,
	            errorMessage: "",
	            submitting: false
	        };
	        _this.handleSubmit = _this.handleSubmit.bind(_this);
	        _this.togglePasswordViewer = _this.togglePasswordViewer.bind(_this);
	        return _this;
	    }

	    _createClass(RegisterForm, [{
	        key: "updateStateFrom",
	        value: function updateStateFrom(props) {
	            var nextState = {};
	            nextState.submitting = props.processing;
	            if (!props.error) {
	                return;
	            }
	            var _props$error = props.error,
	                message = _props$error.message,
	                detail = _props$error.detail;

	            if (!detail) {
	                nextState.errorMessage = message;
	                return this.setState(nextState);
	            }
	            Object.assign(nextState, this.normalizeErrorMessageName((0, _validate.mapValidityStatesToMessages)(detail, ERROR_MESSAGES)));
	            this.setState(nextState);
	        }
	    }, {
	        key: "normalizeErrorMessageName",
	        value: function normalizeErrorMessageName(message) {
	            return {
	                usernameValidityMessage: message.username,
	                passwordValidityMessage: message.password,
	                emailValidityMessage: message.email
	            };
	        }
	    }, {
	        key: "handleSubmit",
	        value: function handleSubmit(evt) {
	            evt.preventDefault();
	            var target = evt.target;
	            var username = target["username"].value;
	            var password = target["password"].value;
	            var email = target["email"].value;

	            var result = (0, _validate.validateRegister)({
	                username: username,
	                password: password,
	                email: email
	            });

	            if (result !== true) {
	                var state = (0, _validate.mapValidityStatesToMessages)(result, ERROR_MESSAGES);
	                this.setState(this.normalizeErrorMessageName(state));
	                return;
	            }
	            this.props.dispatch(actions.register(username, password, email));
	        }
	    }, {
	        key: "togglePasswordViewer",
	        value: function togglePasswordViewer(evt) {
	            evt.preventDefault();
	            this.setState({
	                passwordViewer: !this.state.passwordViewer
	            });
	        }
	    }, {
	        key: "render",
	        value: function render() {
	            var _state = this.state,
	                usernameValidityMessage = _state.usernameValidityMessage,
	                passwordValidityMessage = _state.passwordValidityMessage,
	                emailValidityMessage = _state.emailValidityMessage,
	                passwordViewer = _state.passwordViewer,
	                submitting = _state.submitting,
	                errorMessage = _state.errorMessage;

	            return (0, _preact.h)(
	                "form",
	                { onSubmit: this.handleSubmit, name: "register-form" },
	                (0, _preact.h)(
	                    "div",
	                    { className: "form-ctl" },
	                    (0, _preact.h)(
	                        "label",
	                        { className: "for-text", "for": "ipt-register-username" },
	                        "\u7528\u6237\u540D"
	                    ),
	                    (0, _preact.h)("input", { id: "ipt-register-username", type: "text",
	                        name: "username", required: true }),
	                    usernameValidityMessage && (0, _preact.h)(
	                        "div",
	                        { className: "invalid-message" },
	                        usernameValidityMessage
	                    )
	                ),
	                (0, _preact.h)(
	                    "div",
	                    { className: "form-ctl" },
	                    (0, _preact.h)(
	                        "label",
	                        { className: "for-text", "for": "ipt-register-password" },
	                        "\u5BC6\u7801"
	                    ),
	                    (0, _preact.h)("input", { id: "ipt-register-password",
	                        type: passwordViewer ? "text" : "password",
	                        name: "password", required: true }),
	                    (0, _preact.h)("a", { className: "check-pw-btn", onClick: this.togglePasswordViewer }),
	                    passwordValidityMessage && (0, _preact.h)(
	                        "div",
	                        { className: "invalid-message" },
	                        passwordValidityMessage
	                    )
	                ),
	                (0, _preact.h)(
	                    "div",
	                    { className: "form-ctl" },
	                    (0, _preact.h)(
	                        "label",
	                        { className: "for-text", "for": "ipt-register-email" },
	                        "\u90AE\u7BB1"
	                    ),
	                    (0, _preact.h)("input", { id: "ipt-register-email", type: "email", name: "email" }),
	                    emailValidityMessage && (0, _preact.h)(
	                        "div",
	                        { className: "invalid-message" },
	                        emailValidityMessage
	                    )
	                ),
	                errorMessage && (0, _preact.h)(
	                    "div",
	                    { className: "form-ctl" },
	                    (0, _preact.h)(
	                        "div",
	                        { "class": "tips invalid" },
	                        errorMessage
	                    )
	                ),
	                (0, _preact.h)(
	                    "div",
	                    { className: "form-ctl" },
	                    (0, _preact.h)(
	                        "button",
	                        { disabled: submitting, type: "submit",
	                            className: "btn btn-primary btn-block " + (submitting ? "btn--pending" : "") },
	                        "\u6CE8\u518C"
	                    )
	                )
	            );
	        }
	    }]);

	    return RegisterForm;
	}(_preact.Component);

	var RegisterSuccess = function RegisterSuccess() {
	    return (0, _preact.h)(
	        "div",
	        { className: "register-success-dialog" },
	        (0, _preact.h)(
	            "h2",
	            null,
	            "\u6CE8\u518C\u6210\u529F\uFF01"
	        ),
	        (0, _preact.h)(
	            "a",
	            { className: "btn btn-block btn-primary", href: "/login.html" },
	            "\u767B\u5F55"
	        )
	    );
	};

	var Register = function (_Component2) {
	    _inherits(Register, _Component2);

	    function Register() {
	        var _ref2;

	        _classCallCheck(this, Register);

	        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	            args[_key2] = arguments[_key2];
	        }

	        return _possibleConstructorReturn(this, (_ref2 = Register.__proto__ || Object.getPrototypeOf(Register)).call.apply(_ref2, [this].concat(args)));
	    }

	    _createClass(Register, [{
	        key: "render",
	        value: function render() {
	            var _props = this.props,
	                userInfo = _props.userInfo,
	                dispatch = _props.dispatch,
	                register = _props.register;

	            return (0, _preact.h)(
	                "div",
	                null,
	                (0, _preact.h)(_components.User, _extends({}, userInfo, { dispatch: dispatch })),
	                (0, _preact.h)(_components.Jumbotron, null),
	                (0, _preact.h)(
	                    "div",
	                    { className: "mid" },
	                    (0, _preact.h)(
	                        "div",
	                        { className: "main" },
	                        (0, _preact.h)(_components.Nav, { value: [{ name: "首页", value: "/" }, { name: "注册", value: null }] }),
	                        (0, _preact.h)(
	                            "div",
	                            { className: "register-container" },
	                            register.success ? (0, _preact.h)(RegisterSuccess, null) : (0, _preact.h)(RegisterForm, _extends({}, register, { dispatch: dispatch }))
	                        )
	                    )
	                )
	            );
	        }
	    }]);

	    return Register;
	}(_preact.Component);

	exports.default = Register;

/***/ },

/***/ 529:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _preact = __webpack_require__(1);

	var _components = __webpack_require__(335);

	var Content = function Content(_ref) {
	    var value = _ref.value;
	    return (0, _preact.h)(
	        "div",
	        null,
	        (0, _preact.h)(
	            "div",
	            { className: "message-content" },
	            value
	        ),
	        (0, _preact.h)(
	            "div",
	            { className: "message-content-warning" },
	            (0, _preact.h)(
	                "p",
	                null,
	                (0, _preact.h)(
	                    "i",
	                    { className: "fa-warning" },
	                    "\uF071"
	                ),
	                "\u8BE5\u6D88\u606F\u5185\u5BB9\u7531\u7528\u6237\u4EA7\u751F\uFF0C\u5982\u679C\u5185\u5BB9\u6D89\u53CA\u513F\u7AE5\u8272\u60C5\u3001\u4FB5\u6743\u3001\u8BC8\u9A97\u7B49\uFF0C\u53EF\u4EE5",
	                (0, _preact.h)(
	                    "a",
	                    { href: "mailto:awhile.online@yandex.com?subject=\u4E3E\u62A5&body=" + location.href },
	                    (0, _preact.h)(
	                        "b",
	                        null,
	                        "\u53D1\u9001\u90AE\u4EF6"
	                    )
	                ),
	                "\u4E3E\u62A5\uFF01"
	            )
	        )
	    );
	};

	var NotFound = function NotFound() {
	    return (0, _preact.h)(
	        "div",
	        { className: "message-content-not-found" },
	        (0, _preact.h)(
	            "span",
	            { className: "num" },
	            "404"
	        ),
	        (0, _preact.h)(
	            "span",
	            { className: "desc" },
	            "Not Found"
	        )
	    );
	};

	exports.default = function (_ref2) {
	    var content = _ref2.content,
	        userInfo = _ref2.userInfo,
	        dispatch = _ref2.dispatch;

	    return (0, _preact.h)(
	        "div",
	        null,
	        (0, _preact.h)(_components.User, _extends({}, userInfo, { dispatch: dispatch })),
	        (0, _preact.h)(_components.Jumbotron, null),
	        (0, _preact.h)(
	            "div",
	            { className: "mid" },
	            (0, _preact.h)(
	                "div",
	                { className: "main" },
	                (0, _preact.h)(_components.Nav, { value: [{ name: "首页", value: "/" }, { name: "消息", value: null }] }),
	                (0, _preact.h)(
	                    "div",
	                    { className: "view-message-container" },
	                    content ? (0, _preact.h)(Content, { value: content }) : (0, _preact.h)(NotFound, null)
	                )
	            )
	        )
	    );
	};

/***/ }

});