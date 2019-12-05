import React, {Component} from 'react'
import {
    SafeAreaView,
    StatusBar,
    View, Text, StyleSheet, 
    TouchableOpacity,
    Dimensions,
  } from 'react-native'

  class Card extends Component {
      render() {
          return (
              <TouchableOpacity style={{ ...this.props.style }} onPress={ this.props.onPress }>
                <Text style="{{fontSize: this.props.fontSize || 32}}">{this.props.isShow ? this.props.title : this.props.cover}</Text>
              </TouchableOpacity>
          )
      }
  }

  export default Card
