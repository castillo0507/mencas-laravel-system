/******/ (() => { // webpackBootstrap
/*!************************************!*\
  !*** ./resources/js/mencas-spa.js ***!
  \************************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// Main Application Class
var MencasApp = /*#__PURE__*/function () {
  function MencasApp() {
    _classCallCheck(this, MencasApp);
    this.baseURL = '/api';
    this.token = localStorage.getItem('auth_token');
    this.currentUser = null;
    this.currentPage = 'dashboard';
    this.init();
  }
  return _createClass(MencasApp, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        var _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              if (!this.token) {
                _context.n = 5;
                break;
              }
              this.setAuthToken(this.token);
              _context.p = 1;
              _context.n = 2;
              return this.getCurrentUser();
            case 2:
              this.showApp();
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              this.logout();
            case 4:
              _context.n = 6;
              break;
            case 5:
              this.showLogin();
            case 6:
              this.setupEventListeners();
            case 7:
              return _context.a(2);
          }
        }, _callee, this, [[1, 3]]);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "setAuthToken",
    value: function setAuthToken(token) {
      this.token = token;
      axios.defaults.headers.common['Authorization'] = "Bearer ".concat(token);
      localStorage.setItem('auth_token', token);
    }
  }, {
    key: "getCurrentUser",
    value: function () {
      var _getCurrentUser = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        var response, _t2;
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.p = _context2.n) {
            case 0:
              _context2.p = 0;
              _context2.n = 1;
              return axios.get("".concat(this.baseURL, "/auth/user"));
            case 1:
              response = _context2.v;
              this.currentUser = response.data.user;
              return _context2.a(2, this.currentUser);
            case 2:
              _context2.p = 2;
              _t2 = _context2.v;
              throw _t2;
            case 3:
              return _context2.a(2);
          }
        }, _callee2, this, [[0, 2]]);
      }));
      function getCurrentUser() {
        return _getCurrentUser.apply(this, arguments);
      }
      return getCurrentUser;
    }()
  }, {
    key: "showLogin",
    value: function showLogin() {
      document.getElementById('app').innerHTML = this.getLoginHTML();
      this.setupLoginForm();
    }
  }, {
    key: "showApp",
    value: function showApp() {
      document.getElementById('app').innerHTML = this.getAppHTML();
      this.loadPage('dashboard');
    }
  }, {
    key: "getLoginHTML",
    value: function getLoginHTML() {
      return "\n            <div class=\"login-container\">\n                <div class=\"login-card\">\n                    <div class=\"text-center mb-4\">\n                        <h2 class=\"text-primary\">MENCAS</h2>\n                        <p class=\"text-muted\">Admin Dashboard</p>\n                    </div>\n                    <form id=\"loginForm\">\n                        <div class=\"mb-3\">\n                            <label for=\"email\" class=\"form-label\">Email</label>\n                            <input type=\"email\" class=\"form-control\" id=\"email\" required>\n                        </div>\n                        <div class=\"mb-3\">\n                            <label for=\"password\" class=\"form-label\">Password</label>\n                            <input type=\"password\" class=\"form-control\" id=\"password\" required>\n                        </div>\n                        <button type=\"submit\" class=\"btn btn-primary w-100\">Login</button>\n                    </form>\n                    <div id=\"loginError\" class=\"alert alert-danger mt-3\" style=\"display: none;\"></div>\n                </div>\n            </div>\n        ";
    }
  }, {
    key: "getAppHTML",
    value: function getAppHTML() {
      var _this$currentUser;
      return "\n            <nav class=\"navbar navbar-expand-lg navbar-dark bg-primary\">\n                <div class=\"container-fluid\">\n                    <a class=\"navbar-brand\" href=\"#\">\n                        <i class=\"fas fa-graduation-cap me-2\"></i>MENCAS\n                    </a>\n                    <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navbarNav\">\n                        <span class=\"navbar-toggler-icon\"></span>\n                    </button>\n                    <div class=\"collapse navbar-collapse\" id=\"navbarNav\">\n                        <ul class=\"navbar-nav me-auto\">\n                            <li class=\"nav-item\">\n                                <a class=\"nav-link\" href=\"#\" data-page=\"dashboard\">\n                                    <i class=\"fas fa-tachometer-alt me-1\"></i>Dashboard\n                                </a>\n                            </li>\n                            <li class=\"nav-item\">\n                                <a class=\"nav-link\" href=\"#\" data-page=\"students\">\n                                    <i class=\"fas fa-user-graduate me-1\"></i>Students\n                                </a>\n                            </li>\n                            <li class=\"nav-item\">\n                                <a class=\"nav-link\" href=\"#\" data-page=\"faculty\">\n                                    <i class=\"fas fa-chalkboard-teacher me-1\"></i>Faculty\n                                </a>\n                            </li>\n                            <li class=\"nav-item\">\n                                <a class=\"nav-link\" href=\"#\" data-page=\"courses\">\n                                    <i class=\"fas fa-book me-1\"></i>Courses\n                                </a>\n                            </li>\n                            <li class=\"nav-item\">\n                                <a class=\"nav-link\" href=\"#\" data-page=\"enrollments\">\n                                    <i class=\"fas fa-clipboard-list me-1\"></i>Enrollments\n                                </a>\n                            </li>\n                            <li class=\"nav-item dropdown\">\n                                <a class=\"nav-link dropdown-toggle\" href=\"#\" role=\"button\" data-bs-toggle=\"dropdown\">\n                                    <i class=\"fas fa-chart-bar me-1\"></i>Reports\n                                </a>\n                                <ul class=\"dropdown-menu\">\n                                    <li><a class=\"dropdown-item\" href=\"#\" data-page=\"reports-students\">Students by Course</a></li>\n                                    <li><a class=\"dropdown-item\" href=\"#\" data-page=\"reports-faculty\">Faculty by Department</a></li>\n                                    <li><a class=\"dropdown-item\" href=\"#\" data-page=\"reports-trends\">Enrollment Trends</a></li>\n                                </ul>\n                            </li>\n                        </ul>\n                        <ul class=\"navbar-nav\">\n                            <li class=\"nav-item dropdown\">\n                                <a class=\"nav-link dropdown-toggle\" href=\"#\" role=\"button\" data-bs-toggle=\"dropdown\">\n                                    <i class=\"fas fa-user me-1\"></i>".concat(((_this$currentUser = this.currentUser) === null || _this$currentUser === void 0 ? void 0 : _this$currentUser.name) || 'User', "\n                                </a>\n                                <ul class=\"dropdown-menu\">\n                                    <li><a class=\"dropdown-item\" href=\"#\" data-page=\"profile\">Profile</a></li>\n                                    <li><hr class=\"dropdown-divider\"></li>\n                                    <li><a class=\"dropdown-item\" href=\"#\" id=\"logoutBtn\">Logout</a></li>\n                                </ul>\n                            </li>\n                        </ul>\n                    </div>\n                </div>\n            </nav>\n            <div class=\"container-fluid\">\n                <div id=\"pageContent\" class=\"mt-4\">\n                    <!-- Page content will be loaded here -->\n                </div>\n            </div>\n            \n            <!-- Loading overlay -->\n            <div id=\"loadingOverlay\" class=\"loading-overlay\" style=\"display: none;\">\n                <div class=\"spinner-border text-primary\" role=\"status\">\n                    <span class=\"visually-hidden\">Loading...</span>\n                </div>\n            </div>\n            \n            <!-- Modal for forms -->\n            <div class=\"modal fade\" id=\"formModal\" tabindex=\"-1\">\n                <div class=\"modal-dialog modal-lg\">\n                    <div class=\"modal-content\">\n                        <div class=\"modal-header\">\n                            <h5 class=\"modal-title\" id=\"formModalLabel\">Form</h5>\n                            <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\"></button>\n                        </div>\n                        <div class=\"modal-body\" id=\"formModalBody\">\n                            <!-- Form content will be loaded here -->\n                        </div>\n                    </div>\n                </div>\n            </div>\n        ");
    }
  }, {
    key: "setupLoginForm",
    value: function setupLoginForm() {
      var _this = this;
      var form = document.getElementById('loginForm');
      form.addEventListener('submit', /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
          var email, password, errorDiv, response, _error$response, _t3;
          return _regenerator().w(function (_context3) {
            while (1) switch (_context3.p = _context3.n) {
              case 0:
                e.preventDefault();
                email = document.getElementById('email').value;
                password = document.getElementById('password').value;
                errorDiv = document.getElementById('loginError');
                _context3.p = 1;
                _context3.n = 2;
                return axios.post("".concat(_this.baseURL, "/auth/login"), {
                  email: email,
                  password: password
                });
              case 2:
                response = _context3.v;
                if (response.data.success) {
                  _this.setAuthToken(response.data.token);
                  _this.currentUser = response.data.user;
                  _this.showApp();
                } else {
                  errorDiv.textContent = response.data.message;
                  errorDiv.style.display = 'block';
                }
                _context3.n = 4;
                break;
              case 3:
                _context3.p = 3;
                _t3 = _context3.v;
                errorDiv.textContent = ((_error$response = _t3.response) === null || _error$response === void 0 || (_error$response = _error$response.data) === null || _error$response === void 0 ? void 0 : _error$response.message) || 'Login failed';
                errorDiv.style.display = 'block';
              case 4:
                return _context3.a(2);
            }
          }, _callee3, null, [[1, 3]]);
        }));
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      var _this2 = this;
      // Navigation
      document.addEventListener('click', function (e) {
        if (e.target.matches('[data-page]')) {
          e.preventDefault();
          var page = e.target.getAttribute('data-page');
          _this2.loadPage(page);
        }
        if (e.target.matches('#logoutBtn')) {
          e.preventDefault();
          _this2.logout();
        }
      });
    }
  }, {
    key: "loadPage",
    value: function () {
      var _loadPage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(page) {
        var _document$querySelect;
        var content, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              this.currentPage = page;
              this.showLoading();

              // Update active nav
              document.querySelectorAll('.nav-link').forEach(function (link) {
                link.classList.remove('active');
              });
              (_document$querySelect = document.querySelector("[data-page=\"".concat(page, "\"]"))) === null || _document$querySelect === void 0 || _document$querySelect.classList.add('active');
              _context4.p = 1;
              _context4.n = 2;
              return this.getPageContent(page);
            case 2:
              content = _context4.v;
              document.getElementById('pageContent').innerHTML = content;
              this.setupPageEventListeners(page);
              _context4.n = 4;
              break;
            case 3:
              _context4.p = 3;
              _t4 = _context4.v;
              console.error('Error loading page:', _t4);
              this.showError('Failed to load page content');
            case 4:
              _context4.p = 4;
              this.hideLoading();
              return _context4.f(4);
            case 5:
              return _context4.a(2);
          }
        }, _callee4, this, [[1, 3, 4, 5]]);
      }));
      function loadPage(_x2) {
        return _loadPage.apply(this, arguments);
      }
      return loadPage;
    }()
  }, {
    key: "getPageContent",
    value: function () {
      var _getPageContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(page) {
        var _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              _t5 = page;
              _context5.n = _t5 === 'dashboard' ? 1 : _t5 === 'students' ? 3 : _t5 === 'faculty' ? 5 : _t5 === 'courses' ? 7 : _t5 === 'enrollments' ? 9 : _t5 === 'reports-students' ? 11 : _t5 === 'reports-faculty' ? 13 : _t5 === 'reports-trends' ? 15 : 17;
              break;
            case 1:
              _context5.n = 2;
              return this.getDashboardContent();
            case 2:
              return _context5.a(2, _context5.v);
            case 3:
              _context5.n = 4;
              return this.getStudentsContent();
            case 4:
              return _context5.a(2, _context5.v);
            case 5:
              _context5.n = 6;
              return this.getFacultyContent();
            case 6:
              return _context5.a(2, _context5.v);
            case 7:
              _context5.n = 8;
              return this.getCoursesContent();
            case 8:
              return _context5.a(2, _context5.v);
            case 9:
              _context5.n = 10;
              return this.getEnrollmentsContent();
            case 10:
              return _context5.a(2, _context5.v);
            case 11:
              _context5.n = 12;
              return this.getReportsStudentsContent();
            case 12:
              return _context5.a(2, _context5.v);
            case 13:
              _context5.n = 14;
              return this.getReportsFacultyContent();
            case 14:
              return _context5.a(2, _context5.v);
            case 15:
              _context5.n = 16;
              return this.getReportsTrendsContent();
            case 16:
              return _context5.a(2, _context5.v);
            case 17:
              return _context5.a(2, '<h1>Page not found</h1>');
            case 18:
              return _context5.a(2);
          }
        }, _callee5, this);
      }));
      function getPageContent(_x3) {
        return _getPageContent.apply(this, arguments);
      }
      return getPageContent;
    }()
  }, {
    key: "getDashboardContent",
    value: function () {
      var _getDashboardContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
        var response, data;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              _context6.n = 1;
              return axios.get("".concat(this.baseURL, "/dashboard"));
            case 1:
              response = _context6.v;
              data = response.data.data;
              return _context6.a(2, "\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <h1 class=\"h3 mb-4\">Dashboard Overview</h1>\n                </div>\n            </div>\n            \n            <div class=\"row mb-4\">\n                <div class=\"col-md-3\">\n                    <div class=\"card bg-primary text-white\">\n                        <div class=\"card-body\">\n                            <div class=\"d-flex justify-content-between\">\n                                <div>\n                                    <h4>".concat(data.statistics.totalStudents, "</h4>\n                                    <p class=\"mb-0\">Total Students</p>\n                                </div>\n                                <div class=\"align-self-center\">\n                                    <i class=\"fas fa-user-graduate fa-2x\"></i>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-md-3\">\n                    <div class=\"card bg-success text-white\">\n                        <div class=\"card-body\">\n                            <div class=\"d-flex justify-content-between\">\n                                <div>\n                                    <h4>").concat(data.statistics.totalFaculty, "</h4>\n                                    <p class=\"mb-0\">Total Faculty</p>\n                                </div>\n                                <div class=\"align-self-center\">\n                                    <i class=\"fas fa-chalkboard-teacher fa-2x\"></i>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-md-3\">\n                    <div class=\"card bg-info text-white\">\n                        <div class=\"card-body\">\n                            <div class=\"d-flex justify-content-between\">\n                                <div>\n                                    <h4>").concat(data.statistics.totalCourses, "</h4>\n                                    <p class=\"mb-0\">Total Courses</p>\n                                </div>\n                                <div class=\"align-self-center\">\n                                    <i class=\"fas fa-book fa-2x\"></i>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-md-3\">\n                    <div class=\"card bg-warning text-white\">\n                        <div class=\"card-body\">\n                            <div class=\"d-flex justify-content-between\">\n                                <div>\n                                    <h4>").concat(data.statistics.totalDepartments, "</h4>\n                                    <p class=\"mb-0\">Total Departments</p>\n                                </div>\n                                <div class=\"align-self-center\">\n                                    <i class=\"fas fa-building fa-2x\"></i>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"row\">\n                <div class=\"col-md-6\">\n                    <div class=\"card\">\n                        <div class=\"card-header\">\n                            <h5>Students by Department</h5>\n                        </div>\n                        <div class=\"card-body\">\n                            <canvas id=\"studentsByDeptChart\" width=\"400\" height=\"200\"></canvas>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-md-6\">\n                    <div class=\"card\">\n                        <div class=\"card-header\">\n                            <h5>Recent Enrollments</h5>\n                        </div>\n                        <div class=\"card-body\">\n                            <div class=\"table-responsive\">\n                                <table class=\"table table-sm\">\n                                    <thead>\n                                        <tr>\n                                            <th>Student</th>\n                                            <th>Course</th>\n                                            <th>Date</th>\n                                        </tr>\n                                    </thead>\n                                    <tbody>\n                                        ").concat(data.recentEnrollments.map(function (enrollment) {
                return "\n                                            <tr>\n                                                <td>".concat(enrollment.student.first_name, " ").concat(enrollment.student.last_name, "</td>\n                                                <td>").concat(enrollment.course.name, "</td>\n                                                <td>").concat(new Date(enrollment.created_at).toLocaleDateString(), "</td>\n                                            </tr>\n                                        ");
              }).join(''), "\n                                    </tbody>\n                                </table>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        "));
          }
        }, _callee6, this);
      }));
      function getDashboardContent() {
        return _getDashboardContent.apply(this, arguments);
      }
      return getDashboardContent;
    }()
  }, {
    key: "getStudentsContent",
    value: function () {
      var _getStudentsContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
        var response, students;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              _context7.n = 1;
              return axios.get("".concat(this.baseURL, "/students"));
            case 1:
              response = _context7.v;
              students = response.data.data;
              return _context7.a(2, "\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <div class=\"d-flex justify-content-between align-items-center mb-4\">\n                        <h1 class=\"h3\">Students Management</h1>\n                        <button class=\"btn btn-primary\" id=\"addStudentBtn\">\n                            <i class=\"fas fa-plus me-2\"></i>Add Student\n                        </button>\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"card\">\n                <div class=\"card-body\">\n                    <div class=\"table-responsive\">\n                        <table class=\"table\">\n                            <thead>\n                                <tr>\n                                    <th>Student ID</th>\n                                    <th>Name</th>\n                                    <th>Email</th>\n                                    <th>Department</th>\n                                    <th>Status</th>\n                                    <th>Actions</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                ".concat(students.data.map(function (student) {
                var _student$department;
                return "\n                                    <tr>\n                                        <td>".concat(student.student_id, "</td>\n                                        <td>").concat(student.first_name, " ").concat(student.last_name, "</td>\n                                        <td>").concat(student.email, "</td>\n                                        <td>").concat(((_student$department = student.department) === null || _student$department === void 0 ? void 0 : _student$department.name) || 'N/A', "</td>\n                                        <td><span class=\"badge bg-").concat(student.status === 'active' ? 'success' : 'secondary', "\">").concat(student.status, "</span></td>\n                                        <td>\n                                            <button class=\"btn btn-sm btn-outline-primary\" onclick=\"app.editStudent(").concat(student.id, ")\">\n                                                <i class=\"fas fa-edit\"></i>\n                                            </button>\n                                            <button class=\"btn btn-sm btn-outline-danger\" onclick=\"app.deleteStudent(").concat(student.id, ")\">\n                                                <i class=\"fas fa-trash\"></i>\n                                            </button>\n                                        </td>\n                                    </tr>\n                                ");
              }).join(''), "\n                            </tbody>\n                        </table>\n                    </div>\n                    \n                    ").concat(this.getPaginationHTML(students), "\n                </div>\n            </div>\n        "));
          }
        }, _callee7, this);
      }));
      function getStudentsContent() {
        return _getStudentsContent.apply(this, arguments);
      }
      return getStudentsContent;
    }()
  }, {
    key: "getFacultyContent",
    value: function () {
      var _getFacultyContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
        var response, faculty;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.n) {
            case 0:
              _context8.n = 1;
              return axios.get("".concat(this.baseURL, "/faculty"));
            case 1:
              response = _context8.v;
              faculty = response.data.data;
              return _context8.a(2, "\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <div class=\"d-flex justify-content-between align-items-center mb-4\">\n                        <h1 class=\"h3\">Faculty Management</h1>\n                        <button class=\"btn btn-primary\" id=\"addFacultyBtn\">\n                            <i class=\"fas fa-plus me-2\"></i>Add Faculty\n                        </button>\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"card\">\n                <div class=\"card-body\">\n                    <div class=\"table-responsive\">\n                        <table class=\"table\">\n                            <thead>\n                                <tr>\n                                    <th>Employee ID</th>\n                                    <th>Name</th>\n                                    <th>Email</th>\n                                    <th>Department</th>\n                                    <th>Position</th>\n                                    <th>Status</th>\n                                    <th>Actions</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                ".concat(faculty.data.map(function (member) {
                var _member$department;
                return "\n                                    <tr>\n                                        <td>".concat(member.employee_id, "</td>\n                                        <td>").concat(member.first_name, " ").concat(member.last_name, "</td>\n                                        <td>").concat(member.email, "</td>\n                                        <td>").concat(((_member$department = member.department) === null || _member$department === void 0 ? void 0 : _member$department.name) || 'N/A', "</td>\n                                        <td>").concat(member.position, "</td>\n                                        <td><span class=\"badge bg-").concat(member.status === 'active' ? 'success' : 'secondary', "\">").concat(member.status, "</span></td>\n                                        <td>\n                                            <button class=\"btn btn-sm btn-outline-primary\" onclick=\"app.editFaculty(").concat(member.id, ")\">\n                                                <i class=\"fas fa-edit\"></i>\n                                            </button>\n                                            <button class=\"btn btn-sm btn-outline-danger\" onclick=\"app.deleteFaculty(").concat(member.id, ")\">\n                                                <i class=\"fas fa-trash\"></i>\n                                            </button>\n                                        </td>\n                                    </tr>\n                                ");
              }).join(''), "\n                            </tbody>\n                        </table>\n                    </div>\n                    \n                    ").concat(this.getPaginationHTML(faculty), "\n                </div>\n            </div>\n        "));
          }
        }, _callee8, this);
      }));
      function getFacultyContent() {
        return _getFacultyContent.apply(this, arguments);
      }
      return getFacultyContent;
    }()
  }, {
    key: "getCoursesContent",
    value: function () {
      var _getCoursesContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
        var response, courses;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.n) {
            case 0:
              _context9.n = 1;
              return axios.get("".concat(this.baseURL, "/courses"));
            case 1:
              response = _context9.v;
              courses = response.data.data;
              return _context9.a(2, "\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <div class=\"d-flex justify-content-between align-items-center mb-4\">\n                        <h1 class=\"h3\">Courses Management</h1>\n                        <button class=\"btn btn-primary\" id=\"addCourseBtn\">\n                            <i class=\"fas fa-plus me-2\"></i>Add Course\n                        </button>\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"card\">\n                <div class=\"card-body\">\n                    <div class=\"table-responsive\">\n                        <table class=\"table\">\n                            <thead>\n                                <tr>\n                                    <th>Code</th>\n                                    <th>Name</th>\n                                    <th>Department</th>\n                                    <th>Credits</th>\n                                    <th>Actions</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                ".concat(courses.data.map(function (course) {
                var _course$department;
                return "\n                                    <tr>\n                                        <td>".concat(course.code, "</td>\n                                        <td>").concat(course.name, "</td>\n                                        <td>").concat(((_course$department = course.department) === null || _course$department === void 0 ? void 0 : _course$department.name) || 'N/A', "</td>\n                                        <td>").concat(course.credits, "</td>\n                                        <td>\n                                            <button class=\"btn btn-sm btn-outline-primary\" onclick=\"app.editCourse(").concat(course.id, ")\">\n                                                <i class=\"fas fa-edit\"></i>\n                                            </button>\n                                            <button class=\"btn btn-sm btn-outline-danger\" onclick=\"app.deleteCourse(").concat(course.id, ")\">\n                                                <i class=\"fas fa-trash\"></i>\n                                            </button>\n                                        </td>\n                                    </tr>\n                                ");
              }).join(''), "\n                            </tbody>\n                        </table>\n                    </div>\n                    \n                    ").concat(this.getPaginationHTML(courses), "\n                </div>\n            </div>\n        "));
          }
        }, _callee9, this);
      }));
      function getCoursesContent() {
        return _getCoursesContent.apply(this, arguments);
      }
      return getCoursesContent;
    }()
  }, {
    key: "getEnrollmentsContent",
    value: function () {
      var _getEnrollmentsContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
        var _this3 = this;
        var response, enrollments;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.n) {
            case 0:
              _context0.n = 1;
              return axios.get("".concat(this.baseURL, "/enrollments"));
            case 1:
              response = _context0.v;
              enrollments = response.data.data;
              return _context0.a(2, "\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <div class=\"d-flex justify-content-between align-items-center mb-4\">\n                        <h1 class=\"h3\">Enrollments Management</h1>\n                        <button class=\"btn btn-primary\" id=\"addEnrollmentBtn\">\n                            <i class=\"fas fa-plus me-2\"></i>Add Enrollment\n                        </button>\n                    </div>\n                </div>\n            </div>\n            \n            <div class=\"card\">\n                <div class=\"card-body\">\n                    <div class=\"table-responsive\">\n                        <table class=\"table\">\n                            <thead>\n                                <tr>\n                                    <th>Student</th>\n                                    <th>Course</th>\n                                    <th>Enrollment Date</th>\n                                    <th>Status</th>\n                                    <th>Actions</th>\n                                </tr>\n                            </thead>\n                            <tbody>\n                                ".concat(enrollments.data.map(function (enrollment) {
                var _enrollment$student, _enrollment$student2, _enrollment$course;
                return "\n                                    <tr>\n                                        <td>".concat((_enrollment$student = enrollment.student) === null || _enrollment$student === void 0 ? void 0 : _enrollment$student.first_name, " ").concat((_enrollment$student2 = enrollment.student) === null || _enrollment$student2 === void 0 ? void 0 : _enrollment$student2.last_name, "</td>\n                                        <td>").concat((_enrollment$course = enrollment.course) === null || _enrollment$course === void 0 ? void 0 : _enrollment$course.name, "</td>\n                                        <td>").concat(new Date(enrollment.enrollment_date).toLocaleDateString(), "</td>\n                                        <td><span class=\"badge bg-").concat(_this3.getStatusColor(enrollment.status), "\">").concat(enrollment.status, "</span></td>\n                                        <td>\n                                            <button class=\"btn btn-sm btn-outline-primary\" onclick=\"app.editEnrollment(").concat(enrollment.id, ")\">\n                                                <i class=\"fas fa-edit\"></i>\n                                            </button>\n                                            <button class=\"btn btn-sm btn-outline-danger\" onclick=\"app.deleteEnrollment(").concat(enrollment.id, ")\">\n                                                <i class=\"fas fa-trash\"></i>\n                                            </button>\n                                        </td>\n                                    </tr>\n                                ");
              }).join(''), "\n                            </tbody>\n                        </table>\n                    </div>\n                    \n                    ").concat(this.getPaginationHTML(enrollments), "\n                </div>\n            </div>\n        "));
          }
        }, _callee0, this);
      }));
      function getEnrollmentsContent() {
        return _getEnrollmentsContent.apply(this, arguments);
      }
      return getEnrollmentsContent;
    }()
  }, {
    key: "getReportsStudentsContent",
    value: function () {
      var _getReportsStudentsContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        var response, courses;
        return _regenerator().w(function (_context1) {
          while (1) switch (_context1.n) {
            case 0:
              _context1.n = 1;
              return axios.get("".concat(this.baseURL, "/reports/students-by-course"));
            case 1:
              response = _context1.v;
              courses = response.data.data;
              return _context1.a(2, "\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <h1 class=\"h3 mb-4\">Students by Course Report</h1>\n                </div>\n            </div>\n            \n            <div class=\"row\">\n                <div class=\"col-md-8\">\n                    <div class=\"card\">\n                        <div class=\"card-header\">\n                            <h5>Course Enrollment Statistics</h5>\n                        </div>\n                        <div class=\"card-body\">\n                            <canvas id=\"studentsByCourseChart\" width=\"400\" height=\"200\"></canvas>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-md-4\">\n                    <div class=\"card\">\n                        <div class=\"card-header\">\n                            <h5>Course Details</h5>\n                        </div>\n                        <div class=\"card-body\">\n                            <div class=\"table-responsive\">\n                                <table class=\"table table-sm\">\n                                    <thead>\n                                        <tr>\n                                            <th>Course</th>\n                                            <th>Students</th>\n                                        </tr>\n                                    </thead>\n                                    <tbody>\n                                        ".concat(courses.map(function (course) {
                return "\n                                            <tr>\n                                                <td>".concat(course.name, "</td>\n                                                <td><span class=\"badge bg-primary\">").concat(course.enrollments_count, "</span></td>\n                                            </tr>\n                                        ");
              }).join(''), "\n                                    </tbody>\n                                </table>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        "));
          }
        }, _callee1, this);
      }));
      function getReportsStudentsContent() {
        return _getReportsStudentsContent.apply(this, arguments);
      }
      return getReportsStudentsContent;
    }()
  }, {
    key: "getReportsFacultyContent",
    value: function () {
      var _getReportsFacultyContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
        var response, departments;
        return _regenerator().w(function (_context10) {
          while (1) switch (_context10.n) {
            case 0:
              _context10.n = 1;
              return axios.get("".concat(this.baseURL, "/reports/faculty-by-department"));
            case 1:
              response = _context10.v;
              departments = response.data.data;
              return _context10.a(2, "\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <h1 class=\"h3 mb-4\">Faculty by Department Report</h1>\n                </div>\n            </div>\n            \n            <div class=\"row\">\n                <div class=\"col-md-8\">\n                    <div class=\"card\">\n                        <div class=\"card-header\">\n                            <h5>Faculty Distribution</h5>\n                        </div>\n                        <div class=\"card-body\">\n                            <canvas id=\"facultyByDeptChart\" width=\"400\" height=\"200\"></canvas>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"col-md-4\">\n                    <div class=\"card\">\n                        <div class=\"card-header\">\n                            <h5>Department Details</h5>\n                        </div>\n                        <div class=\"card-body\">\n                            <div class=\"table-responsive\">\n                                <table class=\"table table-sm\">\n                                    <thead>\n                                        <tr>\n                                            <th>Department</th>\n                                            <th>Faculty</th>\n                                        </tr>\n                                    </thead>\n                                    <tbody>\n                                        ".concat(departments.map(function (dept) {
                return "\n                                            <tr>\n                                                <td>".concat(dept.name, "</td>\n                                                <td><span class=\"badge bg-success\">").concat(dept.faculty_count, "</span></td>\n                                            </tr>\n                                        ");
              }).join(''), "\n                                    </tbody>\n                                </table>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        "));
          }
        }, _callee10, this);
      }));
      function getReportsFacultyContent() {
        return _getReportsFacultyContent.apply(this, arguments);
      }
      return getReportsFacultyContent;
    }()
  }, {
    key: "getReportsTrendsContent",
    value: function () {
      var _getReportsTrendsContent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
        var response, trends;
        return _regenerator().w(function (_context11) {
          while (1) switch (_context11.n) {
            case 0:
              _context11.n = 1;
              return axios.get("".concat(this.baseURL, "/reports/enrollment-trends"));
            case 1:
              response = _context11.v;
              trends = response.data.data;
              return _context11.a(2, "\n            <div class=\"row\">\n                <div class=\"col-12\">\n                    <h1 class=\"h3 mb-4\">Enrollment Trends Report</h1>\n                </div>\n            </div>\n            \n            <div class=\"card\">\n                <div class=\"card-header\">\n                    <h5>Enrollment Trends Over Time</h5>\n                </div>\n                <div class=\"card-body\">\n                    <canvas id=\"enrollmentTrendsChart\" width=\"400\" height=\"200\"></canvas>\n                    \n                    <div class=\"mt-4\">\n                        <div class=\"table-responsive\">\n                            <table class=\"table table-sm\">\n                                <thead>\n                                    <tr>\n                                        <th>Date</th>\n                                        <th>Enrollments</th>\n                                    </tr>\n                                </thead>\n                                <tbody>\n                                    ".concat(trends.map(function (trend) {
                return "\n                                        <tr>\n                                            <td>".concat(new Date(trend.date).toLocaleDateString(), "</td>\n                                            <td><span class=\"badge bg-info\">").concat(trend.count, "</span></td>\n                                        </tr>\n                                    ");
              }).join(''), "\n                                </tbody>\n                            </table>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        "));
          }
        }, _callee11, this);
      }));
      function getReportsTrendsContent() {
        return _getReportsTrendsContent.apply(this, arguments);
      }
      return getReportsTrendsContent;
    }()
  }, {
    key: "getStatusColor",
    value: function getStatusColor(status) {
      switch (status) {
        case 'active':
        case 'enrolled':
          return 'success';
        case 'completed':
          return 'info';
        case 'dropped':
        case 'failed':
          return 'danger';
        default:
          return 'secondary';
      }
    }
  }, {
    key: "getPaginationHTML",
    value: function getPaginationHTML(paginatedData) {
      if (paginatedData.last_page <= 1) return '';
      var pagination = '<nav><ul class="pagination justify-content-center">';
      for (var i = 1; i <= paginatedData.last_page; i++) {
        var active = i === paginatedData.current_page ? 'active' : '';
        pagination += "<li class=\"page-item ".concat(active, "\">\n                <a class=\"page-link\" href=\"#\" data-page-num=\"").concat(i, "\">").concat(i, "</a>\n            </li>");
      }
      pagination += '</ul></nav>';
      return pagination;
    }
  }, {
    key: "setupPageEventListeners",
    value: function setupPageEventListeners(page) {
      switch (page) {
        case 'dashboard':
          this.setupDashboardCharts();
          break;
        case 'students':
          this.setupStudentsPage();
          break;
        case 'faculty':
          this.setupFacultyPage();
          break;
        case 'courses':
          this.setupCoursesPage();
          break;
        case 'enrollments':
          this.setupEnrollmentsPage();
          break;
        case 'reports-students':
          this.setupReportsChartsStudents();
          break;
        case 'reports-faculty':
          this.setupReportsChartsFaculty();
          break;
        case 'reports-trends':
          this.setupReportsChartsTrends();
          break;
      }
    }
  }, {
    key: "setupDashboardCharts",
    value: function setupDashboardCharts() {
      // Students by Department Chart
      setTimeout(function () {
        var ctx = document.getElementById('studentsByDeptChart');
        if (ctx) {
          // Initialize chart here
          console.log('Chart ready to initialize');
        }
      }, 100);
    }
  }, {
    key: "setupStudentsPage",
    value: function setupStudentsPage() {
      var _this4 = this;
      var addBtn = document.getElementById('addStudentBtn');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          _this4.showStudentForm();
        });
      }
    }
  }, {
    key: "setupFacultyPage",
    value: function setupFacultyPage() {
      var _this5 = this;
      var addBtn = document.getElementById('addFacultyBtn');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          _this5.showFacultyForm();
        });
      }
    }
  }, {
    key: "setupCoursesPage",
    value: function setupCoursesPage() {
      var _this6 = this;
      var addBtn = document.getElementById('addCourseBtn');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          _this6.showCourseForm();
        });
      }
    }
  }, {
    key: "setupEnrollmentsPage",
    value: function setupEnrollmentsPage() {
      var _this7 = this;
      var addBtn = document.getElementById('addEnrollmentBtn');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          _this7.showEnrollmentForm();
        });
      }
    }
  }, {
    key: "setupReportsChartsStudents",
    value: function setupReportsChartsStudents() {
      var _this8 = this;
      setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
        var ctx, response, courses;
        return _regenerator().w(function (_context12) {
          while (1) switch (_context12.n) {
            case 0:
              ctx = document.getElementById('studentsByCourseChart');
              if (!ctx) {
                _context12.n = 2;
                break;
              }
              _context12.n = 1;
              return axios.get("".concat(_this8.baseURL, "/reports/students-by-course"));
            case 1:
              response = _context12.v;
              courses = response.data.data;
              new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: courses.map(function (course) {
                    return course.name;
                  }),
                  datasets: [{
                    label: 'Number of Students',
                    data: courses.map(function (course) {
                      return course.enrollments_count;
                    }),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }
              });
            case 2:
              return _context12.a(2);
          }
        }, _callee12);
      })), 100);
    }
  }, {
    key: "setupReportsChartsFaculty",
    value: function setupReportsChartsFaculty() {
      var _this9 = this;
      setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
        var ctx, response, departments;
        return _regenerator().w(function (_context13) {
          while (1) switch (_context13.n) {
            case 0:
              ctx = document.getElementById('facultyByDeptChart');
              if (!ctx) {
                _context13.n = 2;
                break;
              }
              _context13.n = 1;
              return axios.get("".concat(_this9.baseURL, "/reports/faculty-by-department"));
            case 1:
              response = _context13.v;
              departments = response.data.data;
              new Chart(ctx, {
                type: 'pie',
                data: {
                  labels: departments.map(function (dept) {
                    return dept.name;
                  }),
                  datasets: [{
                    data: departments.map(function (dept) {
                      return dept.faculty_count;
                    }),
                    backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 205, 86, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)'],
                    borderWidth: 1
                  }]
                },
                options: {
                  responsive: true
                }
              });
            case 2:
              return _context13.a(2);
          }
        }, _callee13);
      })), 100);
    }
  }, {
    key: "setupReportsChartsTrends",
    value: function setupReportsChartsTrends() {
      var _this0 = this;
      setTimeout(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
        var ctx, response, trends;
        return _regenerator().w(function (_context14) {
          while (1) switch (_context14.n) {
            case 0:
              ctx = document.getElementById('enrollmentTrendsChart');
              if (!ctx) {
                _context14.n = 2;
                break;
              }
              _context14.n = 1;
              return axios.get("".concat(_this0.baseURL, "/reports/enrollment-trends"));
            case 1:
              response = _context14.v;
              trends = response.data.data;
              new Chart(ctx, {
                type: 'line',
                data: {
                  labels: trends.map(function (trend) {
                    return new Date(trend.date).toLocaleDateString();
                  }),
                  datasets: [{
                    label: 'Enrollments',
                    data: trends.map(function (trend) {
                      return trend.count;
                    }),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                  }]
                },
                options: {
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }
              });
            case 2:
              return _context14.a(2);
          }
        }, _callee14);
      })), 100);
    }
  }, {
    key: "showStudentForm",
    value: function () {
      var _showStudentForm = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16() {
        var _student,
          _student3,
          _student4,
          _student5,
          _student6,
          _student7,
          _student8,
          _student9,
          _student0,
          _student1,
          _this1 = this;
        var studentId,
          deptResponse,
          departments,
          student,
          studentResponse,
          formHTML,
          modal,
          _args16 = arguments;
        return _regenerator().w(function (_context16) {
          while (1) switch (_context16.n) {
            case 0:
              studentId = _args16.length > 0 && _args16[0] !== undefined ? _args16[0] : null;
              _context16.n = 1;
              return axios.get("".concat(this.baseURL, "/departments"));
            case 1:
              deptResponse = _context16.v;
              departments = deptResponse.data.data;
              student = null;
              if (!studentId) {
                _context16.n = 3;
                break;
              }
              _context16.n = 2;
              return axios.get("".concat(this.baseURL, "/students/").concat(studentId));
            case 2:
              studentResponse = _context16.v;
              student = studentResponse.data.data;
            case 3:
              formHTML = "\n            <form id=\"studentForm\">\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Student ID</label>\n                            <input type=\"text\" class=\"form-control\" name=\"student_id\" \n                                   value=\"".concat(((_student = student) === null || _student === void 0 ? void 0 : _student.student_id) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Department</label>\n                            <select class=\"form-select\" name=\"department_id\" required>\n                                <option value=\"\">Select Department</option>\n                                ").concat(departments.map(function (dept) {
                var _student2;
                return "\n                                    <option value=\"".concat(dept.id, "\" ").concat(((_student2 = student) === null || _student2 === void 0 ? void 0 : _student2.department_id) === dept.id ? 'selected' : '', ">\n                                        ").concat(dept.name, "\n                                    </option>\n                                ");
              }).join(''), "\n                            </select>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">First Name</label>\n                            <input type=\"text\" class=\"form-control\" name=\"first_name\" \n                                   value=\"").concat(((_student3 = student) === null || _student3 === void 0 ? void 0 : _student3.first_name) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Last Name</label>\n                            <input type=\"text\" class=\"form-control\" name=\"last_name\" \n                                   value=\"").concat(((_student4 = student) === null || _student4 === void 0 ? void 0 : _student4.last_name) || '', "\" required>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Email</label>\n                            <input type=\"email\" class=\"form-control\" name=\"email\" \n                                   value=\"").concat(((_student5 = student) === null || _student5 === void 0 ? void 0 : _student5.email) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Phone</label>\n                            <input type=\"text\" class=\"form-control\" name=\"phone\" \n                                   value=\"").concat(((_student6 = student) === null || _student6 === void 0 ? void 0 : _student6.phone) || '', "\">\n                        </div>\n                    </div>\n                </div>\n                <div class=\"mb-3\">\n                    <label class=\"form-label\">Address</label>\n                    <textarea class=\"form-control\" name=\"address\" rows=\"2\">").concat(((_student7 = student) === null || _student7 === void 0 ? void 0 : _student7.address) || '', "</textarea>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Enrollment Date</label>\n                            <input type=\"date\" class=\"form-control\" name=\"enrollment_date\" \n                                   value=\"").concat(((_student8 = student) === null || _student8 === void 0 ? void 0 : _student8.enrollment_date) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Status</label>\n                            <select class=\"form-select\" name=\"status\" required>\n                                <option value=\"active\" ").concat(((_student9 = student) === null || _student9 === void 0 ? void 0 : _student9.status) === 'active' ? 'selected' : '', ">Active</option>\n                                <option value=\"inactive\" ").concat(((_student0 = student) === null || _student0 === void 0 ? void 0 : _student0.status) === 'inactive' ? 'selected' : '', ">Inactive</option>\n                                <option value=\"graduated\" ").concat(((_student1 = student) === null || _student1 === void 0 ? void 0 : _student1.status) === 'graduated' ? 'selected' : '', ">Graduated</option>\n                            </select>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"d-flex justify-content-end\">\n                    <button type=\"button\" class=\"btn btn-secondary me-2\" data-bs-dismiss=\"modal\">Cancel</button>\n                    <button type=\"submit\" class=\"btn btn-primary\">\n                        ").concat(student ? 'Update' : 'Create', " Student\n                    </button>\n                </div>\n            </form>\n        ");
              document.getElementById('formModalLabel').textContent = student ? 'Edit Student' : 'Add Student';
              document.getElementById('formModalBody').innerHTML = formHTML;
              modal = new bootstrap.Modal(document.getElementById('formModal'));
              modal.show();

              // Setup form submission
              document.getElementById('studentForm').addEventListener('submit', /*#__PURE__*/function () {
                var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(e) {
                  var formData, data, _error$response2, _t6;
                  return _regenerator().w(function (_context15) {
                    while (1) switch (_context15.p = _context15.n) {
                      case 0:
                        e.preventDefault();
                        formData = new FormData(e.target);
                        data = Object.fromEntries(formData);
                        _context15.p = 1;
                        if (!student) {
                          _context15.n = 3;
                          break;
                        }
                        _context15.n = 2;
                        return axios.put("".concat(_this1.baseURL, "/students/").concat(student.id), data);
                      case 2:
                        _context15.n = 4;
                        break;
                      case 3:
                        _context15.n = 4;
                        return axios.post("".concat(_this1.baseURL, "/students"), data);
                      case 4:
                        modal.hide();
                        _this1.loadPage('students');
                        _this1.showSuccess(student ? 'Student updated successfully' : 'Student created successfully');
                        _context15.n = 6;
                        break;
                      case 5:
                        _context15.p = 5;
                        _t6 = _context15.v;
                        _this1.showError(((_error$response2 = _t6.response) === null || _error$response2 === void 0 || (_error$response2 = _error$response2.data) === null || _error$response2 === void 0 ? void 0 : _error$response2.message) || 'Operation failed');
                      case 6:
                        return _context15.a(2);
                    }
                  }, _callee15, null, [[1, 5]]);
                }));
                return function (_x4) {
                  return _ref5.apply(this, arguments);
                };
              }());
            case 4:
              return _context16.a(2);
          }
        }, _callee16, this);
      }));
      function showStudentForm() {
        return _showStudentForm.apply(this, arguments);
      }
      return showStudentForm;
    }()
  }, {
    key: "editStudent",
    value: function () {
      var _editStudent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17(id) {
        return _regenerator().w(function (_context17) {
          while (1) switch (_context17.n) {
            case 0:
              this.showStudentForm(id);
            case 1:
              return _context17.a(2);
          }
        }, _callee17, this);
      }));
      function editStudent(_x5) {
        return _editStudent.apply(this, arguments);
      }
      return editStudent;
    }()
  }, {
    key: "deleteStudent",
    value: function () {
      var _deleteStudent = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee18(id) {
        var _t7;
        return _regenerator().w(function (_context18) {
          while (1) switch (_context18.p = _context18.n) {
            case 0:
              if (!confirm('Are you sure you want to delete this student?')) {
                _context18.n = 4;
                break;
              }
              _context18.p = 1;
              _context18.n = 2;
              return axios["delete"]("".concat(this.baseURL, "/students/").concat(id));
            case 2:
              this.loadPage('students');
              this.showSuccess('Student deleted successfully');
              _context18.n = 4;
              break;
            case 3:
              _context18.p = 3;
              _t7 = _context18.v;
              this.showError('Failed to delete student');
            case 4:
              return _context18.a(2);
          }
        }, _callee18, this, [[1, 3]]);
      }));
      function deleteStudent(_x6) {
        return _deleteStudent.apply(this, arguments);
      }
      return deleteStudent;
    }()
  }, {
    key: "editFaculty",
    value: function () {
      var _editFaculty = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee19(id) {
        return _regenerator().w(function (_context19) {
          while (1) switch (_context19.n) {
            case 0:
              this.showFacultyForm(id);
            case 1:
              return _context19.a(2);
          }
        }, _callee19, this);
      }));
      function editFaculty(_x7) {
        return _editFaculty.apply(this, arguments);
      }
      return editFaculty;
    }()
  }, {
    key: "deleteFaculty",
    value: function () {
      var _deleteFaculty = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee20(id) {
        var _t8;
        return _regenerator().w(function (_context20) {
          while (1) switch (_context20.p = _context20.n) {
            case 0:
              if (!confirm('Are you sure you want to delete this faculty member?')) {
                _context20.n = 4;
                break;
              }
              _context20.p = 1;
              _context20.n = 2;
              return axios["delete"]("".concat(this.baseURL, "/faculty/").concat(id));
            case 2:
              this.loadPage('faculty');
              this.showSuccess('Faculty deleted successfully');
              _context20.n = 4;
              break;
            case 3:
              _context20.p = 3;
              _t8 = _context20.v;
              this.showError('Failed to delete faculty');
            case 4:
              return _context20.a(2);
          }
        }, _callee20, this, [[1, 3]]);
      }));
      function deleteFaculty(_x8) {
        return _deleteFaculty.apply(this, arguments);
      }
      return deleteFaculty;
    }()
  }, {
    key: "showFacultyForm",
    value: function () {
      var _showFacultyForm = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee22() {
        var _faculty,
          _faculty3,
          _faculty4,
          _faculty5,
          _faculty6,
          _faculty7,
          _faculty8,
          _faculty9,
          _faculty0,
          _faculty1,
          _faculty10,
          _this10 = this;
        var facultyId,
          deptResponse,
          departments,
          faculty,
          facultyResponse,
          formHTML,
          modal,
          _args22 = arguments;
        return _regenerator().w(function (_context22) {
          while (1) switch (_context22.n) {
            case 0:
              facultyId = _args22.length > 0 && _args22[0] !== undefined ? _args22[0] : null;
              _context22.n = 1;
              return axios.get("".concat(this.baseURL, "/departments"));
            case 1:
              deptResponse = _context22.v;
              departments = deptResponse.data.data;
              faculty = null;
              if (!facultyId) {
                _context22.n = 3;
                break;
              }
              _context22.n = 2;
              return axios.get("".concat(this.baseURL, "/faculty/").concat(facultyId));
            case 2:
              facultyResponse = _context22.v;
              faculty = facultyResponse.data.data;
            case 3:
              formHTML = "\n            <form id=\"facultyForm\">\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Employee ID</label>\n                            <input type=\"text\" class=\"form-control\" name=\"employee_id\" \n                                   value=\"".concat(((_faculty = faculty) === null || _faculty === void 0 ? void 0 : _faculty.employee_id) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Department</label>\n                            <select class=\"form-select\" name=\"department_id\" required>\n                                <option value=\"\">Select Department</option>\n                                ").concat(departments.map(function (dept) {
                var _faculty2;
                return "\n                                    <option value=\"".concat(dept.id, "\" ").concat(((_faculty2 = faculty) === null || _faculty2 === void 0 ? void 0 : _faculty2.department_id) === dept.id ? 'selected' : '', ">\n                                        ").concat(dept.name, "\n                                    </option>\n                                ");
              }).join(''), "\n                            </select>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">First Name</label>\n                            <input type=\"text\" class=\"form-control\" name=\"first_name\" \n                                   value=\"").concat(((_faculty3 = faculty) === null || _faculty3 === void 0 ? void 0 : _faculty3.first_name) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Last Name</label>\n                            <input type=\"text\" class=\"form-control\" name=\"last_name\" \n                                   value=\"").concat(((_faculty4 = faculty) === null || _faculty4 === void 0 ? void 0 : _faculty4.last_name) || '', "\" required>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Email</label>\n                            <input type=\"email\" class=\"form-control\" name=\"email\" \n                                   value=\"").concat(((_faculty5 = faculty) === null || _faculty5 === void 0 ? void 0 : _faculty5.email) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Phone</label>\n                            <input type=\"text\" class=\"form-control\" name=\"phone\" \n                                   value=\"").concat(((_faculty6 = faculty) === null || _faculty6 === void 0 ? void 0 : _faculty6.phone) || '', "\">\n                        </div>\n                    </div>\n                </div>\n                <div class=\"mb-3\">\n                    <label class=\"form-label\">Address</label>\n                    <textarea class=\"form-control\" name=\"address\" rows=\"2\">").concat(((_faculty7 = faculty) === null || _faculty7 === void 0 ? void 0 : _faculty7.address) || '', "</textarea>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Position</label>\n                            <input type=\"text\" class=\"form-control\" name=\"position\" \n                                   value=\"").concat(((_faculty8 = faculty) === null || _faculty8 === void 0 ? void 0 : _faculty8.position) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Hire Date</label>\n                            <input type=\"date\" class=\"form-control\" name=\"hire_date\" \n                                   value=\"").concat(((_faculty9 = faculty) === null || _faculty9 === void 0 ? void 0 : _faculty9.hire_date) || '', "\" required>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Salary</label>\n                            <input type=\"number\" class=\"form-control\" name=\"salary\" \n                                   value=\"").concat(((_faculty0 = faculty) === null || _faculty0 === void 0 ? void 0 : _faculty0.salary) || '', "\" required step=\"0.01\">\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Status</label>\n                            <select class=\"form-select\" name=\"status\" required>\n                                <option value=\"active\" ").concat(((_faculty1 = faculty) === null || _faculty1 === void 0 ? void 0 : _faculty1.status) === 'active' ? 'selected' : '', ">Active</option>\n                                <option value=\"inactive\" ").concat(((_faculty10 = faculty) === null || _faculty10 === void 0 ? void 0 : _faculty10.status) === 'inactive' ? 'selected' : '', ">Inactive</option>\n                            </select>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"d-flex justify-content-end\">\n                    <button type=\"button\" class=\"btn btn-secondary me-2\" data-bs-dismiss=\"modal\">Cancel</button>\n                    <button type=\"submit\" class=\"btn btn-primary\">\n                        ").concat(faculty ? 'Update' : 'Create', " Faculty\n                    </button>\n                </div>\n            </form>\n        ");
              document.getElementById('formModalLabel').textContent = faculty ? 'Edit Faculty' : 'Add Faculty';
              document.getElementById('formModalBody').innerHTML = formHTML;
              modal = new bootstrap.Modal(document.getElementById('formModal'));
              modal.show();

              // Setup form submission
              document.getElementById('facultyForm').addEventListener('submit', /*#__PURE__*/function () {
                var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee21(e) {
                  var formData, data, _error$response3, _t9;
                  return _regenerator().w(function (_context21) {
                    while (1) switch (_context21.p = _context21.n) {
                      case 0:
                        e.preventDefault();
                        formData = new FormData(e.target);
                        data = Object.fromEntries(formData);
                        _context21.p = 1;
                        if (!faculty) {
                          _context21.n = 3;
                          break;
                        }
                        _context21.n = 2;
                        return axios.put("".concat(_this10.baseURL, "/faculty/").concat(faculty.id), data);
                      case 2:
                        _context21.n = 4;
                        break;
                      case 3:
                        _context21.n = 4;
                        return axios.post("".concat(_this10.baseURL, "/faculty"), data);
                      case 4:
                        modal.hide();
                        _this10.loadPage('faculty');
                        _this10.showSuccess(faculty ? 'Faculty updated successfully' : 'Faculty created successfully');
                        _context21.n = 6;
                        break;
                      case 5:
                        _context21.p = 5;
                        _t9 = _context21.v;
                        _this10.showError(((_error$response3 = _t9.response) === null || _error$response3 === void 0 || (_error$response3 = _error$response3.data) === null || _error$response3 === void 0 ? void 0 : _error$response3.message) || 'Operation failed');
                      case 6:
                        return _context21.a(2);
                    }
                  }, _callee21, null, [[1, 5]]);
                }));
                return function (_x9) {
                  return _ref6.apply(this, arguments);
                };
              }());
            case 4:
              return _context22.a(2);
          }
        }, _callee22, this);
      }));
      function showFacultyForm() {
        return _showFacultyForm.apply(this, arguments);
      }
      return showFacultyForm;
    }()
  }, {
    key: "showCourseForm",
    value: function () {
      var _showCourseForm = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee24() {
        var _course,
          _course2,
          _course3,
          _course5,
          _this11 = this;
        var courseId,
          deptResponse,
          departments,
          course,
          courseResponse,
          formHTML,
          modal,
          _args24 = arguments;
        return _regenerator().w(function (_context24) {
          while (1) switch (_context24.n) {
            case 0:
              courseId = _args24.length > 0 && _args24[0] !== undefined ? _args24[0] : null;
              _context24.n = 1;
              return axios.get("".concat(this.baseURL, "/departments"));
            case 1:
              deptResponse = _context24.v;
              departments = deptResponse.data.data;
              course = null;
              if (!courseId) {
                _context24.n = 3;
                break;
              }
              _context24.n = 2;
              return axios.get("".concat(this.baseURL, "/courses/").concat(courseId));
            case 2:
              courseResponse = _context24.v;
              course = courseResponse.data.data;
            case 3:
              formHTML = "\n            <form id=\"courseForm\">\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Course Code</label>\n                            <input type=\"text\" class=\"form-control\" name=\"code\" \n                                   value=\"".concat(((_course = course) === null || _course === void 0 ? void 0 : _course.code) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Credits</label>\n                            <input type=\"number\" class=\"form-control\" name=\"credits\" \n                                   value=\"").concat(((_course2 = course) === null || _course2 === void 0 ? void 0 : _course2.credits) || '', "\" required min=\"1\">\n                        </div>\n                    </div>\n                </div>\n                <div class=\"mb-3\">\n                    <label class=\"form-label\">Course Name</label>\n                    <input type=\"text\" class=\"form-control\" name=\"name\" \n                           value=\"").concat(((_course3 = course) === null || _course3 === void 0 ? void 0 : _course3.name) || '', "\" required>\n                </div>\n                <div class=\"mb-3\">\n                    <label class=\"form-label\">Department</label>\n                    <select class=\"form-select\" name=\"department_id\" required>\n                        <option value=\"\">Select Department</option>\n                        ").concat(departments.data.map(function (dept) {
                var _course4;
                return "\n                            <option value=\"".concat(dept.id, "\" ").concat(((_course4 = course) === null || _course4 === void 0 ? void 0 : _course4.department_id) === dept.id ? 'selected' : '', ">\n                                ").concat(dept.name, "\n                            </option>\n                        ");
              }).join(''), "\n                    </select>\n                </div>\n                <div class=\"mb-3\">\n                    <label class=\"form-label\">Description</label>\n                    <textarea class=\"form-control\" name=\"description\" rows=\"3\">").concat(((_course5 = course) === null || _course5 === void 0 ? void 0 : _course5.description) || '', "</textarea>\n                </div>\n                <div class=\"d-flex justify-content-end\">\n                    <button type=\"button\" class=\"btn btn-secondary me-2\" data-bs-dismiss=\"modal\">Cancel</button>\n                    <button type=\"submit\" class=\"btn btn-primary\">\n                        ").concat(course ? 'Update' : 'Create', " Course\n                    </button>\n                </div>\n            </form>\n        ");
              document.getElementById('formModalLabel').textContent = course ? 'Edit Course' : 'Add Course';
              document.getElementById('formModalBody').innerHTML = formHTML;
              modal = new bootstrap.Modal(document.getElementById('formModal'));
              modal.show();

              // Setup form submission
              document.getElementById('courseForm').addEventListener('submit', /*#__PURE__*/function () {
                var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee23(e) {
                  var formData, data, _error$response4, _t0;
                  return _regenerator().w(function (_context23) {
                    while (1) switch (_context23.p = _context23.n) {
                      case 0:
                        e.preventDefault();
                        formData = new FormData(e.target);
                        data = Object.fromEntries(formData);
                        _context23.p = 1;
                        if (!course) {
                          _context23.n = 3;
                          break;
                        }
                        _context23.n = 2;
                        return axios.put("".concat(_this11.baseURL, "/courses/").concat(course.id), data);
                      case 2:
                        _context23.n = 4;
                        break;
                      case 3:
                        _context23.n = 4;
                        return axios.post("".concat(_this11.baseURL, "/courses"), data);
                      case 4:
                        modal.hide();
                        _this11.loadPage('courses');
                        _this11.showSuccess(course ? 'Course updated successfully' : 'Course created successfully');
                        _context23.n = 6;
                        break;
                      case 5:
                        _context23.p = 5;
                        _t0 = _context23.v;
                        _this11.showError(((_error$response4 = _t0.response) === null || _error$response4 === void 0 || (_error$response4 = _error$response4.data) === null || _error$response4 === void 0 ? void 0 : _error$response4.message) || 'Operation failed');
                      case 6:
                        return _context23.a(2);
                    }
                  }, _callee23, null, [[1, 5]]);
                }));
                return function (_x0) {
                  return _ref7.apply(this, arguments);
                };
              }());
            case 4:
              return _context24.a(2);
          }
        }, _callee24, this);
      }));
      function showCourseForm() {
        return _showCourseForm.apply(this, arguments);
      }
      return showCourseForm;
    }()
  }, {
    key: "showEnrollmentForm",
    value: function () {
      var _showEnrollmentForm = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee26() {
        var _enrollment3,
          _enrollment4,
          _enrollment5,
          _enrollment6,
          _enrollment7,
          _this12 = this;
        var enrollmentId,
          _yield$Promise$all,
          _yield$Promise$all2,
          studentsResponse,
          coursesResponse,
          students,
          courses,
          enrollment,
          enrollmentResponse,
          formHTML,
          modal,
          _args26 = arguments;
        return _regenerator().w(function (_context26) {
          while (1) switch (_context26.n) {
            case 0:
              enrollmentId = _args26.length > 0 && _args26[0] !== undefined ? _args26[0] : null;
              _context26.n = 1;
              return Promise.all([axios.get("".concat(this.baseURL, "/students")), axios.get("".concat(this.baseURL, "/courses"))]);
            case 1:
              _yield$Promise$all = _context26.v;
              _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
              studentsResponse = _yield$Promise$all2[0];
              coursesResponse = _yield$Promise$all2[1];
              students = studentsResponse.data.data;
              courses = coursesResponse.data.data;
              enrollment = null;
              if (!enrollmentId) {
                _context26.n = 3;
                break;
              }
              _context26.n = 2;
              return axios.get("".concat(this.baseURL, "/enrollments/").concat(enrollmentId));
            case 2:
              enrollmentResponse = _context26.v;
              enrollment = enrollmentResponse.data.data;
            case 3:
              formHTML = "\n            <form id=\"enrollmentForm\">\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Student</label>\n                            <select class=\"form-select\" name=\"student_id\" required>\n                                <option value=\"\">Select Student</option>\n                                ".concat(students.data.map(function (student) {
                var _enrollment;
                return "\n                                    <option value=\"".concat(student.id, "\" ").concat(((_enrollment = enrollment) === null || _enrollment === void 0 ? void 0 : _enrollment.student_id) === student.id ? 'selected' : '', ">\n                                        ").concat(student.first_name, " ").concat(student.last_name, " (").concat(student.student_id, ")\n                                    </option>\n                                ");
              }).join(''), "\n                            </select>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Course</label>\n                            <select class=\"form-select\" name=\"course_id\" required>\n                                <option value=\"\">Select Course</option>\n                                ").concat(courses.data.map(function (course) {
                var _enrollment2;
                return "\n                                    <option value=\"".concat(course.id, "\" ").concat(((_enrollment2 = enrollment) === null || _enrollment2 === void 0 ? void 0 : _enrollment2.course_id) === course.id ? 'selected' : '', ">\n                                        ").concat(course.code, " - ").concat(course.name, "\n                                    </option>\n                                ");
              }).join(''), "\n                            </select>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Enrollment Date</label>\n                            <input type=\"date\" class=\"form-control\" name=\"enrollment_date\" \n                                   value=\"").concat(((_enrollment3 = enrollment) === null || _enrollment3 === void 0 ? void 0 : _enrollment3.enrollment_date) || '', "\" required>\n                        </div>\n                    </div>\n                    <div class=\"col-md-6\">\n                        <div class=\"mb-3\">\n                            <label class=\"form-label\">Status</label>\n                            <select class=\"form-select\" name=\"status\" required>\n                                <option value=\"enrolled\" ").concat(((_enrollment4 = enrollment) === null || _enrollment4 === void 0 ? void 0 : _enrollment4.status) === 'enrolled' ? 'selected' : '', ">Enrolled</option>\n                                <option value=\"completed\" ").concat(((_enrollment5 = enrollment) === null || _enrollment5 === void 0 ? void 0 : _enrollment5.status) === 'completed' ? 'selected' : '', ">Completed</option>\n                                <option value=\"dropped\" ").concat(((_enrollment6 = enrollment) === null || _enrollment6 === void 0 ? void 0 : _enrollment6.status) === 'dropped' ? 'selected' : '', ">Dropped</option>\n                                <option value=\"failed\" ").concat(((_enrollment7 = enrollment) === null || _enrollment7 === void 0 ? void 0 : _enrollment7.status) === 'failed' ? 'selected' : '', ">Failed</option>\n                            </select>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"d-flex justify-content-end\">\n                    <button type=\"button\" class=\"btn btn-secondary me-2\" data-bs-dismiss=\"modal\">Cancel</button>\n                    <button type=\"submit\" class=\"btn btn-primary\">\n                        ").concat(enrollment ? 'Update' : 'Create', " Enrollment\n                    </button>\n                </div>\n            </form>\n        ");
              document.getElementById('formModalLabel').textContent = enrollment ? 'Edit Enrollment' : 'Add Enrollment';
              document.getElementById('formModalBody').innerHTML = formHTML;
              modal = new bootstrap.Modal(document.getElementById('formModal'));
              modal.show();

              // Setup form submission
              document.getElementById('enrollmentForm').addEventListener('submit', /*#__PURE__*/function () {
                var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee25(e) {
                  var formData, data, _error$response5, _t1;
                  return _regenerator().w(function (_context25) {
                    while (1) switch (_context25.p = _context25.n) {
                      case 0:
                        e.preventDefault();
                        formData = new FormData(e.target);
                        data = Object.fromEntries(formData);
                        _context25.p = 1;
                        if (!enrollment) {
                          _context25.n = 3;
                          break;
                        }
                        _context25.n = 2;
                        return axios.put("".concat(_this12.baseURL, "/enrollments/").concat(enrollment.id), data);
                      case 2:
                        _context25.n = 4;
                        break;
                      case 3:
                        _context25.n = 4;
                        return axios.post("".concat(_this12.baseURL, "/enrollments"), data);
                      case 4:
                        modal.hide();
                        _this12.loadPage('enrollments');
                        _this12.showSuccess(enrollment ? 'Enrollment updated successfully' : 'Enrollment created successfully');
                        _context25.n = 6;
                        break;
                      case 5:
                        _context25.p = 5;
                        _t1 = _context25.v;
                        _this12.showError(((_error$response5 = _t1.response) === null || _error$response5 === void 0 || (_error$response5 = _error$response5.data) === null || _error$response5 === void 0 ? void 0 : _error$response5.message) || 'Operation failed');
                      case 6:
                        return _context25.a(2);
                    }
                  }, _callee25, null, [[1, 5]]);
                }));
                return function (_x1) {
                  return _ref8.apply(this, arguments);
                };
              }());
            case 4:
              return _context26.a(2);
          }
        }, _callee26, this);
      }));
      function showEnrollmentForm() {
        return _showEnrollmentForm.apply(this, arguments);
      }
      return showEnrollmentForm;
    }()
  }, {
    key: "editCourse",
    value: function () {
      var _editCourse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee27(id) {
        return _regenerator().w(function (_context27) {
          while (1) switch (_context27.n) {
            case 0:
              this.showCourseForm(id);
            case 1:
              return _context27.a(2);
          }
        }, _callee27, this);
      }));
      function editCourse(_x10) {
        return _editCourse.apply(this, arguments);
      }
      return editCourse;
    }()
  }, {
    key: "deleteCourse",
    value: function () {
      var _deleteCourse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee28(id) {
        var _t10;
        return _regenerator().w(function (_context28) {
          while (1) switch (_context28.p = _context28.n) {
            case 0:
              if (!confirm('Are you sure you want to delete this course?')) {
                _context28.n = 4;
                break;
              }
              _context28.p = 1;
              _context28.n = 2;
              return axios["delete"]("".concat(this.baseURL, "/courses/").concat(id));
            case 2:
              this.loadPage('courses');
              this.showSuccess('Course deleted successfully');
              _context28.n = 4;
              break;
            case 3:
              _context28.p = 3;
              _t10 = _context28.v;
              this.showError('Failed to delete course');
            case 4:
              return _context28.a(2);
          }
        }, _callee28, this, [[1, 3]]);
      }));
      function deleteCourse(_x11) {
        return _deleteCourse.apply(this, arguments);
      }
      return deleteCourse;
    }()
  }, {
    key: "editEnrollment",
    value: function () {
      var _editEnrollment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee29(id) {
        return _regenerator().w(function (_context29) {
          while (1) switch (_context29.n) {
            case 0:
              this.showEnrollmentForm(id);
            case 1:
              return _context29.a(2);
          }
        }, _callee29, this);
      }));
      function editEnrollment(_x12) {
        return _editEnrollment.apply(this, arguments);
      }
      return editEnrollment;
    }()
  }, {
    key: "deleteEnrollment",
    value: function () {
      var _deleteEnrollment = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee30(id) {
        var _t11;
        return _regenerator().w(function (_context30) {
          while (1) switch (_context30.p = _context30.n) {
            case 0:
              if (!confirm('Are you sure you want to delete this enrollment?')) {
                _context30.n = 4;
                break;
              }
              _context30.p = 1;
              _context30.n = 2;
              return axios["delete"]("".concat(this.baseURL, "/enrollments/").concat(id));
            case 2:
              this.loadPage('enrollments');
              this.showSuccess('Enrollment deleted successfully');
              _context30.n = 4;
              break;
            case 3:
              _context30.p = 3;
              _t11 = _context30.v;
              this.showError('Failed to delete enrollment');
            case 4:
              return _context30.a(2);
          }
        }, _callee30, this, [[1, 3]]);
      }));
      function deleteEnrollment(_x13) {
        return _deleteEnrollment.apply(this, arguments);
      }
      return deleteEnrollment;
    }()
  }, {
    key: "showLoading",
    value: function showLoading() {
      document.getElementById('loadingOverlay').style.display = 'flex';
    }
  }, {
    key: "hideLoading",
    value: function hideLoading() {
      document.getElementById('loadingOverlay').style.display = 'none';
    }
  }, {
    key: "showSuccess",
    value: function showSuccess(message) {
      this.showToast(message, 'success');
    }
  }, {
    key: "showError",
    value: function showError(message) {
      this.showToast(message, 'danger');
    }
  }, {
    key: "showToast",
    value: function showToast(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      var toastHTML = "\n            <div class=\"toast align-items-center text-white bg-".concat(type, " border-0\" role=\"alert\">\n                <div class=\"d-flex\">\n                    <div class=\"toast-body\">").concat(message, "</div>\n                    <button type=\"button\" class=\"btn-close btn-close-white me-2 m-auto\" data-bs-dismiss=\"toast\"></button>\n                </div>\n            </div>\n        ");
      var toastContainer = document.getElementById('toastContainer');
      if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(toastContainer);
      }
      toastContainer.insertAdjacentHTML('beforeend', toastHTML);
      var toastElement = toastContainer.lastElementChild;
      var toast = new bootstrap.Toast(toastElement);
      toast.show();
      toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
      });
    }
  }, {
    key: "logout",
    value: function () {
      var _logout = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee31() {
        var _t12;
        return _regenerator().w(function (_context31) {
          while (1) switch (_context31.p = _context31.n) {
            case 0:
              _context31.p = 0;
              if (!this.token) {
                _context31.n = 1;
                break;
              }
              _context31.n = 1;
              return axios.post("".concat(this.baseURL, "/auth/logout"));
            case 1:
              _context31.n = 3;
              break;
            case 2:
              _context31.p = 2;
              _t12 = _context31.v;
              console.error('Logout error:', _t12);
            case 3:
              _context31.p = 3;
              localStorage.removeItem('auth_token');
              delete axios.defaults.headers.common['Authorization'];
              this.token = null;
              this.currentUser = null;
              this.showLogin();
              return _context31.f(3);
            case 4:
              return _context31.a(2);
          }
        }, _callee31, this, [[0, 2, 3, 4]]);
      }));
      function logout() {
        return _logout.apply(this, arguments);
      }
      return logout;
    }()
  }]);
}(); // Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  window.app = new MencasApp();
});
/******/ })()
;