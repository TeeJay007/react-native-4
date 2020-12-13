import { BarCodeScanner } from "expo-barcode-scanner";
import React, { Component } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { FlatList, ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import dbh from '../db'

const itemDisplay = (item, nav) => (
    <TouchableOpacity style={styles.itemDisplay} onPress={() => {
        nav.navigate('Details', {
            item
        })
    }}>
        <Text style={styles.itemDisplayText}>{item.data}</Text>
    </TouchableOpacity>
)


export default class HomeScreen extends Component{
    constructor({props}){
        super(props)

        this.state = {
            hasPermission: false,
            displayData: []
        }
    }

    componentDidMount(){
        dbh.collection("scans")
        .onSnapshot((doc) => {
            let data = []
            doc.forEach(v => {
                data = [
                    ...data, {
                        id: v.id,
                        data: v.data().data
                    }
                ]
            })
            this.setState({
                displayData: data
            })
        });
    }

    async _navigateToScanner(){
        if(this.state.hasPermission === false){
            const {status} = await BarCodeScanner.requestPermissionsAsync()
            this.setState({
                hasPermission: status === 'granted'
            })
        }

        if(this.state.hasPermission === true)
            this.props.navigation.navigate('Scanner')
    }

    render(){
        return(
            <View style={styles.container}>
                <Button title="Scan" onPress={() => this._navigateToScanner()} />
                <FlatList data={this.state.displayData} renderItem={
                    ({item}) => itemDisplay(item, this.props.navigation)
                } keyExtractor={item => item.id} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    itemDisplay: {
        paddingVertical: 8,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        justifyContent:'center',
        alignContent:'center',
    },
    itemDisplayText: {
        padding: 8,
        fontSize: 24
    }
});