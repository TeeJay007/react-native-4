import { BarCodeScanner } from "expo-barcode-scanner";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class ScannerScreen extends Component{
    constructor({props}){
        super(props)

        this.state = {
            scanned: false
        }
    }
    
    _onBarcodeScanned(result){
        if(this.state.scanned)
            return

        this.setState({
            scanned: true
        })

        this.props.navigation.navigate('Details', {
            scanned: result
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <BarCodeScanner 
                onBarCodeScanned={(barcode) => this._onBarcodeScanned(barcode)}
                style={StyleSheet.absoluteFillObject}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});