import request from 'superagent';

//接口调用
function _request(url, type = 'post', params = {}, onSuccess, onFailed = function (e) {
    alert(e)
}) {
    switch (type) {
        case 'get':
            request
                .get(url)
                .query(params)
                .end(function (err, res) {
                    if (!res) {
                        alert(err);
                        return;
                    }
                    if (res.statusCode == 401) {
                        window.location.href = '/login.page';
                    } else if (res.statusCode == 200) {
                        if (res.text) {
                            let data = JSON.parse(res.text);
                            if (data.result) {
                                onSuccess(data.data);
                            } else {
                                onFailed(data.message);
                            }
                        }
                    } else {
                        alert('服务器错误');
                    }
                });
            break;
        case 'post':
            request
                .post(url)
                .send(params)
                .end(function (err, res) {
                    if (!res) {
                        alert(err);
                        return;
                    }
                    if (res.statusCode == 401) {
                        window.location.href = '/login.page';
                    } else if (res.statusCode == 200) {
                        if (res.body) {
                            if (res.body.result) {
                                onSuccess(res.body);
                            } else {
                                onFailed(res.body.message);
                            }
                        }
                    } else {
                        alert('服务器错误');
                    }
                });
    }

}

module.exports = {

    _request: _request,

    /******************************************************************************
     * User
     ******************************************************************************/
    loginAPI: function (params, onSuccess, onFailed) {
        _request('/api/login', 'post', params, onSuccess, onFailed);
    },
    registerAPI: function (params, onSuccess, onFailed) {
        _request('/api/register', 'post', params, onSuccess, onFailed);
    },
    selectUserListAPI: function (params, onSuccess, onFailed) {
        _request('/api/user/list', 'post', params, onSuccess, onFailed);
    },
    selectUserByNameAPI: function (params, onSuccess, onFailed) {
        _request('/api/user/name', 'post',params,onSuccess, onFailed);
    },
};
