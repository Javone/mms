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

var Login = React.createClass({

    mixins: [Api,CommonFun],

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
            User:initialParams
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
                   User:objectAssign(self.state.User,data.user)
                });
                self.props.actions.changeComponentsState(self.state);
                self.props.history.push(UserRoute.HomePage);
            }, function (error) {
                alert(error);
            });
        }
    },
    handleKeyLogin: function (event) {
        if(event.keyCode==13) {
            this.handleClickLogin();
        }
    },
    handleChangeName: function (event) {
        let param = {
            login_name:event.target.value
        };
        this.setState({
            User:objectAssign(this.state.User,param)
        });
    },
    handleChangePassword: function (event) {
        let param = {
            password:event.target.value
        };
        this.setState({
            User:objectAssign(this.state.User,param)
        });
    },
    handleClickRegister:function () {
        this.props.history.push(UserRoute.Register);
    },

    /******************************************************************************
     * render functions
     ******************************************************************************/
    render: function () {
        return (
            <div className="login-box" onKeyUp={this.handleKeyLogin}>
                <div className="login-logo">人员管理系统</div>
                <div className="login-box-body">
                    <div>
                        <div className="form-group has-feedback">
                            <input type="text"
                                   className="form-control"
                                   placeholder="请输入登录名"
                                   onChange={this.handleChangeName}/>
                            <span className="glyphicon glyphicon-user form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input type="password"
                                   className="form-control"
                                   placeholder="请输入密码"
                                   onChange={this.handleChangePassword}/>
                            <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <button className="btn btn-primary btn-block btn-flat"
                                        style={{margin: '0 auto', width: '100px'}}
                                        onClick={this.handleClickLogin}>登录
                                </button>
                                <button onClick={this.handleClickRegister}>测试注册入口</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = connect(state => ({
    User: state.componentsReducer.User
}), dispatch => ({
    actions: bindActionCreators(ItemsActions, dispatch),
    history: bindActionCreators({replace, goBack, push}, dispatch)
}))(Login);
