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


var movieReviewsFromApi = [
    {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'}, {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'}, {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'},  {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'},  {name: 'Die Hard'}, {name: 'Home Alone 2'}, {name: 'Bourne Identity'}
]
const Item = Picker.Item;
var stories = [];
var categories = ['all', 'education', 'sleep', 'fun'];
var orderTypes = ['asc', 'desc'];
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class StoryStore extends Component{

    constructor() {
        super();
        this.state = {
            isRefreshing: false,
            internet:false,
            dataSource: ds.cloneWithRows(movieReviewsFromApi),
            mode: Picker.MODE_DIALOG,
            color: 'red',
            color1: 'red1',
            order: 'name',
            ot: orderTypes[0],
            cat: categories[0]
        };
    }
    componentDidMount() {
        this._getStartData()
    }
    static _renderRow (rowData) {
        return (<View style={styles.row}><Text style={styles.text}>{rowData.name}</Text></View>)
    }
    _getStartData() {
        fetch('http://hardteddy.ru/api/user/mystories', {
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
                    console.log(responseJson)
                    console.log('Status+ '+responseJson.status)
                    console.log('Telo '+responseJson.body)
                    stories = responseJson.body.stories;
                    this.setState({
                        dataSource: ds.cloneWithRows(stories)
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

    renderFooter () {
        return this.state.isRefreshing ?  <Loader/> : null
    }
    render() {

        return (
            <View style={styles.listParent}>
                <View>
                    <Text>Отсортировать по:</Text>
        <Picker
            style={styles.picker}
            selectedValue={this.state.cat}
            onValueChange={this.onValueChange.bind(this, 'cat')}
            mode="dialog">
            <Item label={categories[0]} value={categories[0]} />
            <Item label={categories[1]} value={categories[1]} />
            <Item label={categories[2]} value={categories[2]} />
            <Item label={categories[3]} value={categories[3]} />
        </Picker>
                    <Text>Порядок сортировки:</Text>
                <Picker
                    style={styles.picker}
                    selectedValue={this.state.ot}
                    onValueChange={this.onValueChange.bind(this, 'ot')}
                    mode="dialog">
                    <Item label={orderTypes[0]} value={orderTypes[0]} />
                    <Item label={orderTypes[1]} value={orderTypes[1]} />
                </Picker>
                    </View>
                <View style={styles.listParent}>
            <ListView
                dataSource={this.state.dataSource}
                renderRow={(rowData) => StoryStore._renderRow(rowData)}
                renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                renderSeparator={StoryStore._renderSeparator}
                renderFooter={this.renderFooter.bind(this)}
                onEndReached={this._onRefresh}
                enableEmptySections={true}
                onEndReachedThreshold={10}
                scrollEventThrottle={10}
                />
                    </View>
            </View>
        );

    }
    changeMode = () => {
        const newMode = this.state.mode === Picker.MODE_DIALOG
            ? Picker.MODE_DROPDOWN
            : Picker.MODE_DIALOG;
        this.setState({mode: newMode});
    };

    onValueChange = (key: string, value: string) => {
        const newState = {};
        newState[key] = value;
        this.setState(newState);
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
    _onRefresh = () => {
        this.setState({isRefreshing: true});
        fetch('http://hardteddy.ru/api/store/story', {
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
                    console.log(responseJson)
                    console.log('Status+ '+responseJson.status)
                    console.log('Telo '+responseJson.body)
                    var storiesNew = responseJson.body.stories;
                    stories=stories.concat(storiesNew);
                    this.setState({
                        dataSource: ds.cloneWithRows(stories),
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

        //setTimeout(() => {
        //
        //
        //    var data = stories.concat(movieReviewsFromApi);
        //    this.setState({
        //        dataSource: ds.cloneWithRows(data),
        //        isRefreshing: false
        //    });
        //}, 2000);
    };


}
var styles = StyleSheet.create({
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
    }
});



