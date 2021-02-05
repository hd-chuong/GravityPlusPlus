import React, { Fragment } from 'react';

import {
  DropdownToggle,
  DropdownMenu,
  Nav,
  Button,
  NavItem,
  UncontrolledTooltip,
  UncontrolledButtonDropdown,
} from 'reactstrap';

import { NavLink } from 'react-router-dom';

import { toast, Bounce } from 'react-toastify';

import { faCalendarAlt, faAngleDown } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import avatar1 from '../../../assets/utils/images/avatars/1.jpg';

class UserBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
    };
  }

  // notify2 = () =>
  //   (this.toastId = toast(
  //     "You don't have any new items in your calendar for today! Go out and play!",
  //     {
  //       transition: Bounce,
  //       closeButton: true,
  //       autoClose: 5000,
  //       position: 'bottom-center',
  //       type: 'success',
  //     },
  //   ));

  render() {
    return (
      <Fragment>
        <div className="header-btn-lg pr-0">
          <div className="widget-content p-0">
            <div className="widget-content-wrapper">
              <div className="widget-content-left">
                <UncontrolledButtonDropdown>
                  <DropdownToggle color="link" className="p-0">
                    <FontAwesomeIcon
                      className="ml-2 opacity-8"
                      icon={faAngleDown}
                    />
                  </DropdownToggle>
                  <DropdownMenu right className="rm-pointers dropdown-menu-lg">
                    <Nav vertical>
                      <NavItem className="nav-item-header">Activity</NavItem>
                      <NavItem>
                        <NavLink className="nav-link" to="/test/">
                          Video tutorials
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>

              {/* <div className="widget-content-right header-user-info ml-3">
                <Button
                  className="btn-shadow p-1"
                  size="sm"
                  onClick={this.notify2}
                  color="info"
                  id="Tooltip-1"
                >
                  <FontAwesomeIcon className="mr-2 ml-2" icon={faCalendarAlt} />
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default UserBox;
