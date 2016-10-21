import React, { Component } from 'react';
import {
    ScrollView,
    StyleSheet,
    RefreshControl,
    TouchableWithoutFeedback,
    RecyclerViewBackedScrollView,
    ListViewDataSource,
    Text,
    ListView,
    View,
    Picker
    } from 'react-native';
import Loader from './Loader.js'

import Button from "react-native-button";
var movieReviewsFromApi = [
    {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'}, {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'}, {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'},  {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'},  {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'}
]
const Item = Picker.Item;
var stories = [];
var categories = [{label:'все', value:'all'}, {label:'обучающие', value:'1'}, {label: 'колыбельные', value:'2'}, {label: 'развлекательные', value:'3'}];
var orderField = [{label:'имя', value:'name'}, {label:'длительность', value:'duration'}, {label: 'цена', value:'price'}];
var orderTypes = [{label:'по возрастанию', value:'asc'}, {label:'по убыванию', value:'desc'}];
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class StoryStore extends Component{

    constructor() {
        super();
        this.state = {
            isRefreshing: false,
            internet:false,
            dataSource: ds.cloneWithRows([]),
            mode: Picker.MODE_DIALOG,
            order: 'name',
            cat: 'all',
            page: 0,
            allStories: false,
            ordtype: 'desc'

        };
    }
    componentDidMount() {
        this._onRefresh(false);
    }
    onBuy(id) {
        fetch('http://hardteddy.ru/api/store/buy', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFubiIsInR5cGUiOiJ1c2VyIn0.hAxAvPxOJCm73rVwR54MwP7P3SKDmFG0Prsn_JGGzcQ'
            },
            body: JSON.stringify({
                storyID: id
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.status == 0){


                }
                else{

                }
            }).catch((error) => {
            });
    }
    _renderRow (rowData) {
        return (
            <View style={styles.row}>
                <Text style={styles.text}>Название: {rowData.name}</Text>
                <Text style={styles.text}>Длительность: {rowData.minutes}:{rowData.seconds}</Text>
                <Text style={styles.text}>Цена: {rowData.price} руб.</Text>
                <Button
                    containerStyle={styles.buttonStyle}
                    style={styles.textStyle}
                    onPress={this.onBuy.bind(this, rowData.id)}
                   >
                    Купить
                </Button >
            </View>)
    }


    renderFooter () {
        return this.state.isRefreshing ?  <Loader/> : null
    }
    render() {
        return (
            <View style={styles.listParent}>
                <View>
                    <Text>Категория:</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.cat}
                        onValueChange={this.onValueChange.bind(this, 'cat')}
                        mode="dialog"
                        prompt="Категория:">
                        { categories.map((s, i) => {
                            return <Item
                                        key={i}
                                        value={s.value}
                                        label={s.label} />
                            }) }
                    </Picker>
                    <Text>Упорядочить по:</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.order}
                        onValueChange={this.onValueChange.bind(this, 'order')}
                        mode="dialog"
                        prompt="Упорядочить по:">
                        { orderField.map((s, i) => {
                            return <Item
                                key={i}
                                value={s.value}
                                label={s.label} />
                        }) }
                    </Picker>
                    <Text>Порядок сортировки:</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={this.state.ordtype}
                        onValueChange={this.onValueChange.bind(this, 'ordtype')}
                        prompt="Порядок сортировки:">
                        { orderTypes.map((s, i) => {
                            return <Item
                                key={i}
                                value={s.value}
                                label={s.label} />
                            }) }
                    </Picker>
                </View>
                <Button
                    containerStyle={styles.buttonStyle7}
                    style={styles.textStyle6}
                    onPress={this._onRefresh.bind(this, false)}
                    >
                    Найти
                </Button >
                <View style={[styles.listParent, styles.container]}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => this._renderRow(rowData)}
                        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                        renderSeparator={StoryStore._renderSeparator}
                        renderFooter={this.renderFooter.bind(this)}
                        onEndReached={this._onRefresh.bind(this, true)}
                        enableEmptySections={true}
                        onEndReachedThreshold={10}
                        scrollEventThrottle={10}
                        />
                </View>
            </View>
        );

    }
    changeMode() {
        const newMode = this.state.mode === Picker.MODE_DIALOG
            ? Picker.MODE_DROPDOWN
            : Picker.MODE_DIALOG;
        this.setState({mode: newMode});
    };

    onValueChange(key: string, value: string) {
        const newState = {};
        newState[key] = value;
        console.log('Before set on valueChange: '+ this.state.ordtype)
        this.setState(newState);
        //this.setState({ordtype: value});
        console.log('state: '+key+' '+value)
        console.log('After set on valueChange: '+ this.state.ordtype)
        //for (var i in this.state) { console.log(i); console.log(this.state[i]); }
        //this._onRefresh(false);
    };

    static _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: adjacentRowHighlighted ? 4 : 1,
                    backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC'
                }}
                />
        );
    }

    _onRefresh(isMore) {
        if (!isMore) {
            this.setState({
                page: 0,
                allStories:false
            })
        }else {
            this.setState({
                page: this.state.page + 1
            });
        }
        console.log('Refresh ordtype: ' + this.state.ordtype);
        //for (var i in this.state) { console.log(i); console.log(this.state[i]); }
        var url = 'http://hardteddy.ru/api/store/story/?order='+this.state.order+'&ordtype='+this.state.ordtype+'&cat='+this.state.cat+'&page='+this.state.page;
        console.log('url: '+ url);
        if (!this.state.allStories) {
            this.setState({isRefreshing: true});
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFubiIsInR5cGUiOiJ1c2VyIn0.hAxAvPxOJCm73rVwR54MwP7P3SKDmFG0Prsn_JGGzcQ'
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    internet:false
                });
                if(responseJson.status == 0){
                    // Все хорошо
                    //console.log(responseJson)
                    //console.log('Status+ '+responseJson.status)
                    var storiesNew = responseJson.body.stories;
                    if (storiesNew.length == 0)  {
                        console.log("AllStoriesYet");
                        this.setState({
                            allStories: true
                        })
                    }

                        if (isMore) {
                            stories=stories.concat(storiesNew);
                        } else {
                            stories=storiesNew;
                        }
                    this.setState({dataSource: ds.cloneWithRows(stories)})


                    this.setState({
                        isRefreshing: false
                    })

                }
                else{
                    console.log('Status+ '+responseJson.status)
                    console.log('Err '+responseJson.body.err)
                }
            })
            .catch((error) => {

            });
        }
    };


}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingBottom: 50
    },
    listParent: {
        flex: 1
    },
    picker: {

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6'
    },
    thumb: {
        width: 64,
        height: 64
    },
    text: {
        flex: 1
    },
    textStyle: {
        fontSize: 6,
        color: '#8e44ad',
        textAlign: 'center'
    },
    buttonStylePressing: {
        borderColor: 'red',
        backgroundColor: 'red'
    },
    buttonStyle: {
        borderColor: '#8e44ad',
        backgroundColor: '#8e44ad',
        borderRadius: 3,
        borderWidth: 1,
        padding: 1
    },
    buttonStyle7: {
        borderColor: '#8e44ad',
        backgroundColor: '#ffffff',
        borderRadius: 3,
        borderWidth: 3,
        padding: 10,
        marginVertical: 15
    },
    textStyle6: {
        color: '#8e44ad',
        textAlign: 'center'
    }
});



