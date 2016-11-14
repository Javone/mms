/**
 * Created by houdong on 16/8/26.
 */

var React = require('react');
import * as ItemsActions from "Actions";
import {bindActionCreators} from "redux";
import {UserRoute} from "UserRoute";
import {connect} from "react-redux";
import Api from "Api";
import CommonFun from "CommonFun";
var initialParams = require('InitialProps').User;
import {replace, goBack, push} from 'redux-router';
var objectAssign = require('object-assign');

var Register = React.createClass({

    mixins: [Api, CommonFun],

    /******************************************************************************
     * life cycle functions
     ******************************************************************************/
    getDefaultProps: function () {
        return {
            User: initialParams
        }
    },
    getInitialState: function () {
        return {
            User: initialParams
        }
    },

    /******************************************************************************
     * event handlers
     ******************************************************************************/
    handleClickLogin: function () {
        let login_name = this.state.User.login_name;
        let password = this.state.User.password;
        let self = this;
        if (login_name == '') {
            alert("请填写登录名");
            return false;
        } else if (password == '') {
            alert("请填写密码");
            return false;
        } else {
            self.loginAPI(this.state.User, function (data) {
                data.user.entry_date = self.dateTransform(data.user.date.entry_date);
                self.setState({
                    User: objectAssign(self.state.User, data.user)
                });
                self.props.actions.changeComponentsState(self.state);
                self.props.history.push(UserRoute.HomePage);
            }, function (error) {
                alert(error);
            });
        }
    },
    handleKeyLogin: function (event) {
        if (event.keyCode == 13) {
            this.handleClickLogin();
        }
    },
    handleChangeName: function (event) {
        let param = {
            login_name: event.target.value
        };
        this.setState({
            User: objectAssign(this.state.User, param)
        });
    },
    handleChangePassword: function (event) {
        let param = {
            password: event.target.value
        };
        this.setState({
            User: objectAssign(this.state.User, param)
        });
    },
    handleClickRegister: function () {

    },

    /******************************************************************************
     * render functions
     ******************************************************************************/
    render: function () {
        return (
            <section className="content">
                <div className="row">
                    <div className="col-md-6">
                        <div className="box box-primary">
                            <div className="box-header with-border">
                                <h3 className="box-title">注册页面</h3>
                            </div>
                            <form role="form">
                                <div className="box-body">
                                    <div className="form-group">
                                        <label>登录名</label>
                                        <input type="text" className="form-control" placeholder="登录系统的登录名"/>
                                    </div>
                                    <div className="form-group">
                                        <label>密码</label>
                                        <input type="password" className="form-control" placeholder="登录系统的密码"/>
                                    </div>
                                    <div className="form-group">
                                        <label>姓名</label>
                                        <input type="text" className="form-control" placeholder="姓名"/>
                                    </div>
                                    <div className="form-group">
                                        <label>性别</label>
                                        <select className="form-control">
                                            <option>男</option>
                                            <option>女</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>年龄</label>
                                        <input type="text" className="form-control" placeholder="请输入整数"/>
                                    </div>
                                    <div className="form-group">
                                        <label>入职日期</label>
                                        <div className="input-group date">
                                            <div className="input-group-addon">
                                                <i className="fa fa-calendar"></i>
                                            </div>
                                            <input type="text" className="form-control pull-right" id="datepicker"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="box-footer">
                                    <button className="btn btn-primary">提交</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
});

module.exports = connect(state => ({
    User: state.componentsReducer.User
}), dispatch => ({
    actions: bindActionCreators(ItemsActions, dispatch),
    history: bindActionCreators({replace, goBack, push}, dispatch)
}))(Register);
