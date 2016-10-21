import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
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
var stories = [];
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
export default class Account extends Component {
    constructor() {
        super();
        this.state = {
            isRefreshing: false,
            internet:false,
            dataSource: ds.cloneWithRows([])
        };
    }
    componentDidMount() {
        this.getList();
    }
    static _renderRow (rowData) {
        return (
            <View style={styles.row}>
                <Text style={styles.text}>Название: {rowData.name}</Text>
                <Text style={styles.text}>Длительность: {rowData.minutes}:{rowData.seconds}</Text>
                <Text style={styles.text}>Цена: {rowData.price} руб.</Text>
            </View>
        )
    }
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
    render() {

        return (
            <View style={[styles.listParent, styles.container]}>
                <Text>Это твои сказки =^.^=</Text>
                <View style={styles.listParent}>
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={(rowData) => Account._renderRow(rowData)}
                        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                        renderSeparator={Account._renderSeparator}
                        enableEmptySections={true}
                        onEndReachedThreshold={10}
                        scrollEventThrottle={10}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this.getList()}
                                tintColor="#ff0000"
                                title="Loading..."
                                titleColor="#00ff00"
                                colors={['#ff0000', '#00ff00', '#0000ff']}
                                progressBackgroundColor="#ffff00"
                            />
                        }
                        />
                </View>
            </View>
        )
    }
    getList() {
       // this.setState({isRefreshing: true});
        var url = 'http://hardteddy.ru/api/user/mystories';
        console.log('url: '+ url);
            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6ImFubiIsInR5cGUiOiJ1c2VyIn0.hAxAvPxOJCm73rVwR54MwP7P3SKDmFG0Prsn_JGGzcQ'
                }
            }).then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson.status == 0){
                        stories = responseJson.body.stories;
                        this.setState({
                            dataSource: ds.cloneWithRows(stories)
                        })
                    }
                    else{
                        console.log('Status+ '+responseJson.status);
                        console.log('Err '+responseJson.body.err)
                    }
                })
                .catch((error) => {

                });
        //this.setState({
        //    isRefreshing: false
        //});

    };

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingBottom: 50
    },
    listParent: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6'
    },
    text: {
        flex: 1
    }

});