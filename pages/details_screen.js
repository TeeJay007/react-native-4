import React, { Component, useRef } from "react";
import { Animated, View, TextInput, Text, Button, StyleSheet, ActivityIndicator } from "react-native";

import * as firebase from 'firebase';
import 'firebase/firestore';
import dbh from '../db'

export default class DetailsScreen extends Component{
    constructor(props){
        super(props)

        this.state = {
            loading: false,
            codeValue: props.route.params.item != undefined ? 
            props.route.params.item.data : '',
        }
    }

    fade = new Animated.Value(0)

    _fadeIn = () => {
        Animated.timing(this.fade, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false
        }).start()
    }

    componentDidMount(){
        this._fadeIn()
    }

    render(){
        const itemData = this.props.route.params

        if(this.state.loading)
            return(
                <View style={[styles.loading, styles.horizontal]}>
                    <ActivityIndicator size="large" color="red" />
                </View>
            )

        if(itemData.scanned !== undefined)
            return(
                <View style={styles.container}>
                    <Text style={styles.header}>Barcode data:</Text>
                    <Text style={styles.itemText}>{itemData.scanned.data}</Text>
                    <Button title="Save" onPress={() => {
                        this.setState({
                            loading: true
                        })

                        dbh.collection('scans').doc().set({
                            data: itemData.scanned.data
                        }).then(() => this.props.navigation.popToTop()).catch(e => {
                            this.setState({
                                loading: false
                            })
                        })
                    }} />
                </View>
            )

        return(
            <View style={styles.container}>
                <Text style={styles.header}>Barcode data:</Text>
                <TextInput
                    style={styles.itemText}
                    onChangeText={text => {
                        this.setState({
                            codeValue: text
                        })
                    }}
                    value={this.state.codeValue}
                    />
                <Button title="Update" onPress={() => {
                    this.setState({
                        loading: true
                    })

                    dbh.collection('scans').doc(itemData.item.id).update({
                        data: this.state.codeValue
                    }).then(() => 
                    this.setState({
                        loading: false
                    })).catch(e => {
                        this.setState({
                            loading: false
                        })
                    })
                }} />
                <Animated.View style={{
                    opacity: this.fade
                }}>
                    <Button color="red" title="Delete" onPress={() => {
                        this.setState({
                            loading: true
                        })

                        dbh.collection('scans').doc(itemData.item.id).delete().then(() => 
                        this.props.navigation.popToTop()).catch(e => {
                            this.setState({
                                loading: false
                            })
                        })
                    }} />
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading:{
        flex: 1,
        justifyContent: 'center',
    },
    header:{
        padding: 8,
        fontSize: 16,
        borderBottomWidth: 2
    },
    itemText: {
        padding: 8,
        fontSize: 24,
    }
});