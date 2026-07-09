// import React, { useCallback, useEffect, useRef, useState } from "react";
// import PropTypes from "prop-types";
// import sidebarData from "./SidebarData";
// import SimpleBar from "simplebar-react";
// import MetisMenu from "metismenujs";
// import withRouter from "../../components/Common/withRouter";
// import { Link } from "react-router-dom";
// // import { withTranslation } from "react-i18next";
// import axios from "axios";
// import { API_URL } from "../../helpers/apiConfig";

// const Sidebar = (props) => {
//   const ref = useRef();
//   const [newSupportCount, setNewSupportCount] = useState(0);

//   const closeSidebarOnMobile = () => {
//     if (window.innerWidth <= 767) {
//       document.body.classList.remove("sidebar-enable");
//     }
//   };
//   useEffect(() => {
//   const handleOutsideClick = (e) => {
//     if (window.innerWidth > 767) return;

//     const isSidebarOpen = document.body.classList.contains("sidebar-enable");
//     if (!isSidebarOpen) return;

//     const sidebar = document.querySelector(".vertical-menu");

//     const clickedInsideSidebar = sidebar && sidebar.contains(e.target);

//     const clickedMenuButton =
//       e.target.closest(".vertical-menu-btn") ||
//       e.target.closest(".button-menu-mobile") ||
//       e.target.closest(".navbar-header button");

//     if (!clickedInsideSidebar && !clickedMenuButton) {
//       document.body.classList.remove("sidebar-enable");
//     }
//   };

//   document.addEventListener("pointerdown", handleOutsideClick);

//   return () => {
//     document.removeEventListener("pointerdown", handleOutsideClick);
//   };
// }, []);

//   const activateParentDropdown = useCallback((item) => {
//     item.classList.add("active");
//     const parent = item.parentElement;
//     const parent2El = parent.childNodes[1];

//     if (parent2El && parent2El.id !== "side-menu") {
//       parent2El.classList.add("mm-show");
//     }

//     if (parent) {
//       parent.classList.add("mm-active");
//       const parent2 = parent.parentElement;

//       if (parent2) {
//         parent2.classList.add("mm-show");
//         const parent3 = parent2.parentElement;

//         if (parent3) {
//           parent3.classList.add("mm-active");
//           parent3.childNodes[0].classList.add("mm-active");
//           const parent4 = parent3.parentElement;

//           if (parent4) {
//             parent4.classList.add("mm-show");
//             const parent5 = parent4.parentElement;

//             if (parent5) {
//               parent5.classList.add("mm-show");
//               parent5.childNodes[0].classList.add("mm-active");
//             }
//           }
//         }
//       }

//       scrollElement(item);
//       return false;
//     }

//     scrollElement(item);
//     return false;
//   }, []);

//   const removeActivation = (items) => {
//     for (let i = 0; i < items.length; ++i) {
//       const item = items[i];
//       const parent = items[i].parentElement;

//       if (item && item.classList.contains("active")) {
//         item.classList.remove("active");
//       }

//       if (parent) {
//         const parent2El =
//           parent.childNodes && parent.childNodes.length && parent.childNodes[1]
//             ? parent.childNodes[1]
//             : null;

//         if (parent2El && parent2El.id !== "side-menu") {
//           parent2El.classList.remove("mm-show");
//         }

//         parent.classList.remove("mm-active");
//         const parent2 = parent.parentElement;

//         if (parent2) {
//           parent2.classList.remove("mm-show");
//           const parent3 = parent2.parentElement;

//           if (parent3) {
//             parent3.classList.remove("mm-active");
//             parent3.childNodes[0].classList.remove("mm-active");
//             const parent4 = parent3.parentElement;

//             if (parent4) {
//               parent4.classList.remove("mm-show");
//               const parent5 = parent4.parentElement;

//               if (parent5) {
//                 parent5.classList.remove("mm-show");
//                 parent5.childNodes[0].classList.remove("mm-active");
//               }
//             }
//           }
//         }
//       }
//     }
//   };

//   const activeMenu = useCallback(() => {
//     const pathName = props.router.location.pathname;
//     const ul = document.getElementById("side-menu-item");

//     if (!ul) return;

//     const items = ul.getElementsByTagName("a");

//     removeActivation(items);

//     let matchingMenuItem = null;
//     for (let i = 0; i < items.length; ++i) {
//       if (pathName === items[i].pathname) {
//         matchingMenuItem = items[i];
//         break;
//       }
//     }

//     if (matchingMenuItem) {
//       activateParentDropdown(matchingMenuItem);
//     }
//   }, [props.router.location.pathname, activateParentDropdown]);

//   const fetchSupportAlertCount = useCallback(async () => {
//     try {
//       const res = await axios.get(API_URL("/api/support-messages/"));

//       const supportMessages = Array.isArray(res)
//         ? res
//         : Array.isArray(res?.data)
//         ? res.data
//         : Array.isArray(res?.results)
//         ? res.results
//         : Array.isArray(res?.data?.results)
//         ? res.data.results
//         : [];

//       const lastSeenSupportId = Number(
//         localStorage.getItem("lastSeenSupportId") || 0
//       );

//       const count = supportMessages.filter(
//         (item) => Number(item.id) > lastSeenSupportId
//       ).length;

//       setNewSupportCount(count);
//     } catch (error) {
//       console.error("Sidebar support alert error:", error);
//       setNewSupportCount(0);
//     }
//   }, []);

//   useEffect(() => {
//     if (ref.current) {
//       ref.current.recalculate();
//     }
//   }, []);

//   useEffect(() => {
//     new MetisMenu("#side-menu-item");
//     activeMenu();
//   }, [activeMenu]);

//   useEffect(() => {
//     activeMenu();
//   }, [activeMenu]);

//   useEffect(() => {
//     fetchSupportAlertCount();

//     const interval = setInterval(() => {
//       fetchSupportAlertCount();
//     }, 5000);

//     const handleStorageChange = () => {
//       fetchSupportAlertCount();
//     };

//     window.addEventListener("storage", handleStorageChange);
//     window.addEventListener("focus", fetchSupportAlertCount);

//     return () => {
//       clearInterval(interval);
//       window.removeEventListener("storage", handleStorageChange);
//       window.removeEventListener("focus", fetchSupportAlertCount);
//     };
//   }, [fetchSupportAlertCount]);

//   function scrollElement(item) {
//     if (item) {
//       const currentPosition = item.offsetTop;
//       if (currentPosition > window.innerHeight && ref.current) {
//         ref.current.getScrollElement().scrollTop = currentPosition - 300;
//       }
//     }
//   }

//   return (
//     <React.Fragment>
//       <div className="vertical-menu">
//         <SimpleBar className="h-100" ref={ref}>
//           <div id="sidebar-menu">
//             <ul className="metismenu list-unstyled" id="side-menu-item">
//               {(sidebarData || []).map((item, key) => (
//                 <React.Fragment key={key}>
//                   {item.isMainMenu ? (
//                     <li className="menu-title">{props.t(item.label)}</li>
//                   ) : (
//                     <li>
//                       <Link
//                         to={item.url ? item.url : "/#"}
//                         onClick={() => {
//                           if (!item.subItem && !item.isHasArrow) {
//                             closeSidebarOnMobile();
//                           }
//                         }}
//                         className={
//                           item.subItem || item.isHasArrow ? "has-arrow" : ""
//                         }
//                         style={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                           gap: "10px",
//                           borderRadius: "8px",
//                           paddingRight: "12px",
//                         }}
//                       >
//                         <span
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             minWidth: 0,
//                             gap: "8px",
//                           }}
//                         >
//                           <i
//                             className={item.icon}
//                             style={{ marginRight: "0px" }}
//                           ></i>
//                           <span>{props.t(item.label)}</span>
//                         </span>

//                         <span
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "8px",
//                             marginLeft: "auto",
//                           }}
//                         >
//                           {item.issubMenubadge && (
//                             <span
//                               className={"badge rounded-pill " + item.bgcolor}
//                             >
//                               {item.badgeValue}
//                             </span>
//                           )}

//                           {item.id === "notifications" &&
//                             newSupportCount > 0 && (
//                               <span
//                                 className="badge rounded-pill bg-danger"
//                                 style={{
//                                   minWidth: "22px",
//                                   height: "22px",
//                                   display: "inline-flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                   fontSize: "11px",
//                                   fontWeight: "600",
//                                   boxShadow:
//                                     "0 4px 10px rgba(220,53,69,0.35)",
//                                 }}
//                               >
//                                 {newSupportCount}
//                               </span>
//                             )}
//                         </span>
//                       </Link>

//                       {item.subItem && (
//                         <ul className="sub-menu">
//                           {item.subItem.map((subItem, subKey) => (
//                             <li key={subKey}>
//                               <Link
//                                 to={subItem.link}
//                                 onClick={() => {
//                                   if (!subItem.subMenu) {
//                                     closeSidebarOnMobile();
//                                   }
//                                 }}
//                                 className={
//                                   subItem.subMenu
//                                     ? "has-arrow waves-effect"
//                                     : ""
//                                 }
//                               >
//                                 {props.t(subItem.sublabel)}
//                               </Link>

//                               {subItem.subMenu && (
//                                 <ul className="sub-menu">
//                                   {subItem.subMenu.map(
//                                     (nestedItem, nestedKey) => (
//                                       <li key={nestedKey}>
//                                         <Link
//                                           to="#"
//                                           onClick={closeSidebarOnMobile}
//                                         >
//                                           {props.t(nestedItem.title)}
//                                         </Link>
//                                       </li>
//                                     )
//                                   )}
//                                 </ul>
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </li>
//                   )}
//                 </React.Fragment>
//               ))}
//             </ul>
//           </div>
//         </SimpleBar>
//       </div>
//     </React.Fragment>
//   );
// };

// Sidebar.propTypes = {
//   location: PropTypes.object,
//   t: PropTypes.any,
// };

// export default withRouter(Sidebar);

import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import sidebarData from "./SidebarData";
import SimpleBar from "simplebar-react";
import MetisMenu from "metismenujs";
import withRouter from "../../components/Common/withRouter";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../helpers/apiConfig";

const Sidebar = (props) => {
  const ref = useRef();
  const [newSupportCount, setNewSupportCount] = useState(0);

  const closeSidebarOnMobile = () => {
    if (window.innerWidth <= 767) {
      document.body.classList.remove("sidebar-enable");
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (window.innerWidth > 767) return;

      const isSidebarOpen = document.body.classList.contains("sidebar-enable");
      if (!isSidebarOpen) return;

      const sidebar = document.querySelector(".vertical-menu");

      const clickedInsideSidebar = sidebar && sidebar.contains(e.target);

      const clickedMenuButton =
        e.target.closest(".vertical-menu-btn") ||
        e.target.closest(".button-menu-mobile") ||
        e.target.closest(".navbar-header button");

      if (!clickedInsideSidebar && !clickedMenuButton) {
        document.body.classList.remove("sidebar-enable");
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");
        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active");
          parent3.childNodes[0].classList.add("mm-active");
          const parent4 = parent3.parentElement;

          if (parent4) {
            parent4.classList.add("mm-show");
            const parent5 = parent4.parentElement;

            if (parent5) {
              parent5.classList.add("mm-show");
              parent5.childNodes[0].classList.add("mm-active");
            }
          }
        }
      }

      scrollElement(item);
      return false;
    }

    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (let i = 0; i < items.length; ++i) {
      const item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }

      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;

        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");
          const parent3 = parent2.parentElement;

          if (parent3) {
            parent3.classList.remove("mm-active");
            parent3.childNodes[0].classList.remove("mm-active");
            const parent4 = parent3.parentElement;

            if (parent4) {
              parent4.classList.remove("mm-show");
              const parent5 = parent4.parentElement;

              if (parent5) {
                parent5.classList.remove("mm-show");
                parent5.childNodes[0].classList.remove("mm-active");
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = props.router.location.pathname;
    const ul = document.getElementById("side-menu-item");

    if (!ul) return;

    const items = ul.getElementsByTagName("a");

    removeActivation(items);

    let matchingMenuItem = null;
    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }

    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [props.router.location.pathname, activateParentDropdown]);

  const fetchSupportAlertCount = useCallback(async () => {
    try {
      const res = await axios.get(API_URL("/api/support-messages/"));

      const supportMessages = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.results)
        ? res.results
        : Array.isArray(res?.data?.results)
        ? res.data.results
        : [];

      const lastSeenSupportId = Number(
        localStorage.getItem("lastSeenSupportId") || 0
      );

      const count = supportMessages.filter(
        (item) => Number(item.id) > lastSeenSupportId
      ).length;

      setNewSupportCount(count);
    } catch (error) {
      console.error("Sidebar support alert error:", error);
      setNewSupportCount(0);
    }
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.recalculate();
    }
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu-item");
    activeMenu();
  }, [activeMenu]);

  useEffect(() => {
    activeMenu();
  }, [activeMenu]);

  useEffect(() => {
    fetchSupportAlertCount();

    const interval = setInterval(() => {
      fetchSupportAlertCount();
    }, 5000);

    const handleStorageChange = () => {
      fetchSupportAlertCount();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", fetchSupportAlertCount);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", fetchSupportAlertCount);
    };
  }, [fetchSupportAlertCount]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight && ref.current) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <div className="vertical-menu">
        <SimpleBar className="h-100" ref={ref}>
          <div id="sidebar-menu">
            <ul className="metismenu list-unstyled" id="side-menu-item">
              {(sidebarData || []).map((item, key) => (
                <React.Fragment key={key}>
                  {item.isMainMenu ? (
                    <li className="menu-title">{item.label}</li>
                  ) : (
                    <li>
                      <Link
                        to={item.url ? item.url : "/#"}
                        onClick={() => {
                          if (!item.subItem && !item.isHasArrow) {
                            closeSidebarOnMobile();
                          }
                        }}
                        className={
                          item.subItem || item.isHasArrow ? "has-arrow" : ""
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "10px",
                          borderRadius: "8px",
                          paddingRight: "12px",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: 0,
                            gap: "8px",
                          }}
                        >
                          <i
                            className={item.icon}
                            style={{ marginRight: "0px" }}
                          ></i>
                          <span>{item.label}</span>
                        </span>

                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginLeft: "auto",
                          }}
                        >
                          {item.issubMenubadge && (
                            <span
                              className={"badge rounded-pill " + item.bgcolor}
                            >
                              {item.badgeValue}
                            </span>
                          )}

                          {item.id === "notifications" &&
                            newSupportCount > 0 && (
                              <span
                                className="badge rounded-pill bg-danger"
                                style={{
                                  minWidth: "22px",
                                  height: "22px",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "11px",
                                  fontWeight: "600",
                                  boxShadow:
                                    "0 4px 10px rgba(220,53,69,0.35)",
                                }}
                              >
                                {newSupportCount}
                              </span>
                            )}
                        </span>
                      </Link>

                      {item.subItem && (
                        <ul className="sub-menu">
                          {item.subItem.map((subItem, subKey) => (
                            <li key={subKey}>
                              <Link
                                to={subItem.link}
                                onClick={() => {
                                  if (!subItem.subMenu) {
                                    closeSidebarOnMobile();
                                  }
                                }}
                                className={
                                  subItem.subMenu
                                    ? "has-arrow waves-effect"
                                    : ""
                                }
                              >
                                {subItem.sublabel}
                              </Link>

                              {subItem.subMenu && (
                                <ul className="sub-menu">
                                  {subItem.subMenu.map(
                                    (nestedItem, nestedKey) => (
                                      <li key={nestedKey}>
                                        <Link
                                          to="#"
                                          onClick={closeSidebarOnMobile}
                                        >
                                          {nestedItem.title}
                                        </Link>
                                      </li>
                                    )
                                  )}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </SimpleBar>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  router: PropTypes.object,
};

export default withRouter(Sidebar);