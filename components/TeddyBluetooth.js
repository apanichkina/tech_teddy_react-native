/**
 * Created by ihelos on 04.11.16.
 */
import BluetoothSerial from 'react-native-bluetooth-hc05'

class BlueManager {
    isFetching = false;

    story = false
    storyList = []

    stop = function (func) {
        BluetoothSerial.off('data', func);
        this.unsubscribe();
        this.isFetching = false;
    }.bind(this);

    // TODO: внутри этого модуля контролировать соединение с девайсом:
    // например, если внезапно отключился — сообщить вьюшкам

    errors = {
        isFetching: 'already fetching write now',
        disconnected: 'not connected',
        timeoutExpired: 'timeout limit expired',
        unknown: 'bluetooth problem',
        enableManual: 'Please, enable BT manually'
    };

    talkToBear(bear_endmsg, bear_delimeter, onAnswer, message) {
        return function (timeout = 10000) {
            var read = function (endmsg, delimeter, resolve, reject, stop) {
                var temp = function (data) {
                    onAnswer(endmsg, delimeter, resolve, reject, data);
                    stop(temp);
                };
                return temp;
            };

            return new Promise((resolve, reject) => {
                var delimeter = bear_delimeter;
                var endmsg = bear_endmsg;
                var temp = read(endmsg, delimeter, resolve, reject, this.stop);
                if (this.isFetching == true) {
                    reject(this.errors.isFetching)
                }
                else {
                    this.isFetching = true;
                    BluetoothSerial.isConnected().then(
                        result => {
                            if (result) {
                                setTimeout(() => {
                                    this.stop(temp);
                                    reject(this.errors.timeoutExpired);
                                }, timeout);
                                this.subscribe(endmsg);
                                BluetoothSerial.on('data', temp);
                                BluetoothSerial.write(message);
                            }
                            else {
                                this.stop(temp);
                                reject(this.errors.disconnected);
                            }
                        }
                    ).catch(error => {
                            this.stop(temp);
                            reject(this.errors.unknown);
                        }
                    );
                }
            });
        }.bind(this)
    }

    unsubscribe = function () {
        BluetoothSerial.unsubscribe()
            .then((res) => {
            })
            .catch((err) => {
            })
    };

    discoverUnpairedDevices(){
        return BluetoothSerial.discoverUnpairedDecices();
    }

    subscribe = function (msg) {
        BluetoothSerial.subscribe(msg)
            .then((res) => {
            })
            .catch((err) => {
            })
    };

    enable () {
        // TODO: для iOS вернуть ошибку 'enable BT manually'
        return BluetoothSerial.enable()
    }

    disable () {
        return BL.disable()
    }


/*    getStoryList(timeout = 2000) {
        var read = function (endmsg, delimeter, resolve, stop) {
            var temp = function (data) {
                var datastr = data.data.toString().replace(endmsg, '');
                console.log(datastr);
                var templist = datastr.split(delimeter);
                var len = templist.length;
                if (len > 0) {
                    templist.splice(len - 1, 1)
                }
                resolve(templist);
                stop(temp);
            };
            return temp;
        };
        return new Promise((resolve, reject) => {
            var delimeter = '\r\n';
            var endmsg = 'end\r\n';
    
            var temp = read(endmsg, delimeter, resolve, this.stop);
            if (this.isFetching == true) {
                reject("already fetching write now")
            }
            else {
                this.isFetching = true;
                BluetoothSerial.isConnected().then(
                    result => {
                        if (result) {
                            setTimeout(() => {
                                this.stop(temp);
                                reject("timeout limit expired");
                            }, timeout);
                            this.subscribe(endmsg);
                            BluetoothSerial.on('data', temp);
                            BluetoothSerial.write('l\n');
                        }
                        else {
                            this.stop(temp);
                            reject("not connected");
                        }
                    }
                ).catch(error => {
                        this.stop(temp);
                        reject("bluetooth problems");
                    }
                );
            }
        });
    }*/

    getStoryList(timeout = 2000) {
        var process = this.talkToBear(
            // КОНЕЦ ВСЕГО ОБЩЕНИЯ С МИШКОЙ
            'list\r\n',
            // РАЗДЕЛИТЕЛЬ
            '\r\n',
            // ФУНКЦИЯ НА ПРИЕМ СООБЩЕНИЯ
            // endmsg - переданный выше
            // delimeter - переданный выше
            // resolve - функция, в которую нужно передать ответ для внешнего мира, если все хорошо
            // reject - функция, в которую нужно передать информацию об ошибке для внешнего мира, если все плохо
            // data - данные от медведя
            (endmsg, delimeter, resolve, reject, data)=> {
                var datastr = data.data.toString().replace(endmsg, '');
                console.log(datastr);
                var templist = datastr.split(delimeter);
                var len = templist.length;
                if (len > 0) {
                    templist.splice(len - 1, 1)
                }
                storyList = templist
                resolve(templist);
            },
            //СООБЩЕНИЕ
            'l\n');
        return process(timeout)
    }

    connect(id) {
        return new Promise((resolve, reject) => {
            if (this.isFetching == false) {
                this.isFetching = true;
                BluetoothSerial.connect(id).then(response => {
                    resolve(response);
                    this.isFetching = false;
                }).catch(error => {

                    if (error.code == 'EUNSPECIFIED') {
                        setTimeout(()=> {
                            reject(error);
                            this.isFetching = false
                        }, 100)
                    }else {
                        reject(error);
                        this.isFetching = false;
                    }
                });

            }
            else {
                reject(this.errors.isFetching)
            }
        })
    };

    /**
     * Disconnect from bluetooth device
     */
    disconnect() {
        return new Promise((resolve, reject) => {
            if (this.isFetching == false) {
                this.isFetching = true;
                BluetoothSerial.disconnect().then(response => {
                    resolve(response);
                    this.isFetching = false;
                }).catch(error => {
                    reject(error);
                    this.isFetching = false;
                });

            }
            else {
                reject(this.errors.isFetching)
            }
        })
    };

    isConnected() {
        // resolve (true / false)
        // reject (error)
        return BluetoothSerial.isConnected();
    }

    play(filename, timeout = 2000) {
        console.log('s' + filename + '\n');
        var process = this.talkToBear(
            'story\r\n',
            '\r\n',
            (endmsg, delimeter, resolve, reject, data)=> {
                var datastr = data.data.toString().replace(endmsg, '');
                resolve(datastr);
            },
            's' + filename + '\n');
        return process(timeout)
    }

    pause_unpause(timeout = 2000) {
        var process = this.talkToBear(
            'pause\r\n',
            '\r\n',
            (endmsg, delimeter, resolve, reject, data)=> {
                var datastr = data.data.toString().replace(endmsg, '');
                resolve(datastr);
            },
            'p\n');
        return process(timeout)
    }

    downloadFile(filename, timeout = 2000) {
        var process = this.talkToBear(
            'download\r\n',
            '\r\n',
            (endmsg, delimeter, resolve, reject, data)=> {
                var datastr = data.data.toString().replace(endmsg, '');
                resolve(datastr);
            },
            'y' + filename + '\n');
        return process(timeout)
    }

    removeFile(filename, timeout = 2000) {
        var process = this.talkToBear(
            'remove\r\n',
            '\r\n',
            (endmsg, delimeter, resolve, reject, data)=> {
                var datastr = data.data.toString().replace(endmsg, '');
                resolve(datastr);
            },
            'r' + filename + '\n');
        return process(timeout)
    }

    setAlarm (time, days, active, timeout = 2000) {

        var d = 0;
         
        for (var i = 0; i < 7; ++i) {
            d += (days[i] ? 1 : 0) << i
        }

        var a = (active.lightActive ? 1 : 0)
        a += (active.vibroActive ? 1 : 0) << 1
        a += (active.soundActive ? 1 : 0) << 2
        a += (active.clock ? 1 : 0) << 3

        var h = String.fromCharCode(time.getHours())
        var m = String.fromCharCode(time.getMinutes())
        var d = String.fromCharCode(d)
        var a = String.fromCharCode(a)

        var process = this.talkToBear(
            'alarm\r\n',
            '\r\n',
            (endmsg, delimeter, resolve, reject, data)=> {
                var datastr = data.data.toString().replace(endmsg, '');
                resolve(datastr);
            },
            't'+h+m+d+a+'\n');
        return process(timeout)

    }

    getAlarmTime (timeout = 2000) {

        var process = this.talkToBear(
            'alarm\r\n',
            '\r\n',
            (endmsg, delimeter, resolve, reject, data)=> {
                var datastr = data.data.toString().replace(endmsg, '');
                resolve(datastr);
            },
            't\n');
        return process(timeout)

    }

    setTime (timeout = 2000) {

        var time = new Date()
        var z = (time.getTimezoneOffset() / -60).toFixed()

        var process = this.talkToBear(
            'date\r\n',
            '\r\n',
            (endmsg, delimeter, resolve, reject, data)=> {
                var datastr = data.data.toString().replace(endmsg, '');
                resolve(datastr);
            },
            'd'+(time.getTime() / 1000).toFixed()+'\n'+z+'\n');
        return process(timeout)

    }

}

export default Singleton = (function () {
    var instance;

    function createInstance() {
        var object = new BlueManager();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();