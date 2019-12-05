import React, { Component } from 'react'
import Card from './Card'
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { thisTypeAnnotation } from '@babel/types'

class App extends Component {
  state = {
    cardSymbols: [
      '☺️', '🤩', '😎', '💩', '❤️', '⭐️', '🤘', '👍', '🤓', '😱', 
      '😀','😃', '😆', '😅', '😂', '🤣', '😇','🙂','🙃', '😉',
      '😌','😍','😘','😋', '😛', '😝', '😜', '🤪', '🤨', '🧐',
      '😏', '😒', '😞', '😖', '😫', '😭', '😢', '😤', '😡', '🤬',
      '🤯', '🤑', '🤠', '😈','👿', '👹', '👺', '👻', '🎃', '👍'
    ],
    cardSymbolsInRand: [],
    isOpen: [], 
    firstPickedIndex: null,
    secondPickedIndex: null,
    steps: 0,
    isEnded: false,
    boardSize: 2
  }

  componentDidMount() 
  {
    this.resetGame(2)
  }
  
  cardPressHandler = (index) => {
    let newIsOpen = [...this.state.isOpen]
    
    // Check if the picked one is already picked
    if (newIsOpen[index]) {
      return;
    }
    newIsOpen[index] = true
    // Check the current game flow
    if (this.state.firstPickedIndex == null && this.state.secondPickedIndex == null) {
      // First Choice
      this.setState({
        isOpen: newIsOpen,
        firstPickedIndex: index,
      })
    } else if (this.state.firstPickedIndex != null && this.state.secondPickedIndex == null) {
      // Second Choice

      // async
      this.setState({
        isOpen: newIsOpen,
        secondPickedIndex: index,
        steps: this.state.steps + 1
      })
    }
  }
  
  calculateGameResult = () => {
    if (this.state.firstPickedIndex != null && this.state.secondPickedIndex != null) {
      // Calculate if the game is ended
      if (this.state.cardSymbolsInRand.length > 0) {
        let totalOpens = this.state.isOpen.filter((isOpen) => isOpen)
        if (totalOpens.length == this.state.cardSymbolsInRand.length) {
          this.setState({
            isEnded: true,
          })
          return
        }
        
        // Determind if two card are the same
        let firstSymbol = this.state.cardSymbolsInRand[this.state.firstPickedIndex]
        let secondSymbol = this.state.cardSymbolsInRand[this.state.secondPickedIndex]
        
        if (firstSymbol != secondSymbol) {
          // Incorrect, uncover soon
          setTimeout(() => {
            let newIsOpen = [...this.state.isOpen]
            newIsOpen[this.state.firstPickedIndex] = false
            newIsOpen[this.state.secondPickedIndex] = false
            
            this.setState({
              firstPickedIndex: null,
              secondPickedIndex: null,
              isOpen: newIsOpen
            })
          }, 1000)
        } else {
          // Correct
          this.setState({
            firstPickedIndex: null,
            secondPickedIndex: null,
          })
        }
      }
    }
  }
  
  componentDidUpdate(prevProps, prevState) 
  {
    if (prevState.secondPickedIndex != this.state.secondPickedIndex) {
      this.calculateGameResult()
    }
  }
  
  shuffleArray = (arr) => {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr
  }

  boardSizeBtnPressHandler = (increase) => {
    if(increase){
      if(this.state.boardSize == 10) return
      let newBoardSize = this.state.boardSize + 2
      this.resetGame(newBoardSize)
    }else{
      if(this.state.boardSize == 2) return
      let newBoardSize = this.state.boardSize - 2
      this.resetGame(newBoardSize)
    }
  }

  resetGame = (size) => {
    let symbols = []
    for(let i = 0; i < size*size / 2; i++){
      symbols.push(this.state.cardSymbols[i])
    }

    let newCardSymbols = [...symbols, ...symbols]
    let cardSymbolsInRand = this.shuffleArray(newCardSymbols)
    
    // Init isOpen Array according to the length of symbol array
    let isOpen = []
    for (let i = 0; i < newCardSymbols.length; i++) {
      isOpen.push(false)
    }

    this.setState({
      cardSymbolsInRand: cardSymbolsInRand,
      isOpen: isOpen, 
      firstPickedIndex: null,
      secondPickedIndex: null,
      steps: 0,
      isEnded: false,
      boardSize: size
    })    
  }
  
  render() {
    return (
      <>
      <StatusBar />
      <SafeAreaView style={ styles.container }>
      <View style={ styles.header }>
      <Text style={ styles.heading }>
      Matching Game
      </Text>
      </View>
      <View style={ styles.main }> 
        <View style={ styles.multiplier}>
          <TouchableOpacity style={styles.button} onPress={() => this.boardSizeBtnPressHandler(false)} disabled={this.state.steps > 0}> 
            <Text>-</Text>
          </TouchableOpacity>
          <View style={styles.multiplierTextContainer}>
            <Text style={ styles.multiplierText}>{this.state.boardSize} x {this.state.boardSize}</Text>
            </View>
          <TouchableOpacity style={styles.button} onPress={() => this.boardSizeBtnPressHandler(true)} disabled={this.state.steps > 0}> 
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      <View style={ {...styles.gameBoard} }>
      {this.state.cardSymbolsInRand.map((symbol, index) => 
        <Card key={index} style={ {...styles.button, margin: (Dimensions.get('window').width - (48 * this.state.boardSize)) / (this.state.boardSize * 2) } } onPress={ () => this.cardPressHandler(index) } fontSize={30} title={symbol} cover="❓" isShow={this.state.isOpen[index]}></Card>
        )}
        </View>
        </View>
        <Text style={ styles.footerText }>
        {this.state.isEnded
          ? `Congrats! You have completed in ${this.state.steps} steps.`
          : `You have tried ${this.state.steps} time(s).`
        }
        </Text>
        {
          this.state.isEnded ?
          <TouchableOpacity onPress={ () => this.resetGame(2) } style={ styles.tryAgainButton }>
          <Text style={ styles.tryAgainButtonText }>Try Again</Text>
          </TouchableOpacity>
          : null 
        }
        </SafeAreaView>
        </>
        )
      }
    }
    
    styles = StyleSheet.create({
      container: {
        flex: 1,
      },
      multiplier: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
      },
      multiplierText: {
        fontSize: 30,
        marginLeft: 10,
        marginRight: 10
      },
      multiplierTextContainer: {
        justifyContent: 'center',
        alignItems: 'center'
      },
      header: {
        flex: 1,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center'
      },
      heading: {
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center'
      },
      main: {
        flex: 3,
      },
      footer: {
        flex: 1,
        backgroundColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center'
      },
      footerText: {
        fontSize: 20,
        textAlign: 'center'
      },
     gameBoard: {
       flex: 1,
       flexDirection: 'row',
       justifyContent: 'space-evenly',
       alignItems: 'center',
       flexWrap: 'wrap',
       alignContent: 'center',
     },
     button: {
       backgroundColor: '#ccc',
       borderRadius: 8,
       width: 48,
       height: 48,
       justifyContent: 'center',
       alignItems: 'center',
     },
     buttonText: {
       fontSize: 30,
     },
      tryAgainButton: {
       backgroundColor: '#eee',
       padding: 8,
       borderRadius: 8,
       marginTop: 20,
     },
     tryAgainButtonText: {
       fontSize: 18,
       textAlign: 'center'
     },  
    })    
    
    export default App 
