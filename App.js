import React, { Component } from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import Card from './Card'

class App extends Component {
  state = {
    cardSymbols: [
      '☺️', '🤩', '😎', '💩', '❤️', '⭐️', '🤘', '👍', '😺', '👊', '✌️', '👅', '💑', '🐱', '🙉', '🐟', '🌚', '🌈',
      '🌼', '🥝', '🍕', '🍆', '🍞', '🎹', '🚗', '🚘', '🚐', '🚆', '🚊', '✈️', '💎', '💜', '💙', '✅', '‼️', '💯',
      '♋️', '💗', '💝', '💖', '📕', '🔒', '🎈', '🔑', '🔮', '💣', '⏰', '🔦', '⏱', '📺', '🕹', '💿', '📱', '🎆',
    ],
    cardSymbolsInRand: [],
    isOpen: [],
    firstPickedIndex: null,
    secondPickedIndex: null,
    steps: 0,
    isEnded: false,
    multiplier: 4,
    buttonSize: 80,
    fontSize: 46,
  }

  initGame = () => {
    // Duplicate Symbols x 2
    let newCardSymbols = []

    for (let i = 0; i < this.state.multiplier * this.state.multiplier / 2; i++) {
      for (let j = 0; j < 2; j++) {
        newCardSymbols.push(this.state.cardSymbols[i]);
      }
    }

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
    })
  }

  resetGame = () => {
    this.initGame()
  }

  componentDidMount() {
    this.initGame()
  }

  shuffleArray = (arr) => {
    const newArr = arr.slice()
    for (let i = newArr.length - 1; i > 0; i--) {
      const rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr
  };

  cardPressHandler = (index) => {
    let newIsOpen = [...this.state.isOpen]

    // Check if the picked one is already picked
    if (newIsOpen[index]) {
      return;
    }

    console.log(index)

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
      this.setState({
        isOpen: newIsOpen,
        secondPickedIndex: index,
      })
    }

    this.setState({
      steps: this.state.steps + 1,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.secondPickedIndex != this.state.secondPickedIndex) {
      this.calculateGameResult()
    } else if (prevState.multiplier != this.state.multiplier) {
      this.initGame()
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
      }

      // Determind if two cards are the same
      let firstSymbol = this.state.cardSymbolsInRand[this.state.firstPickedIndex]
      let secondSymbol = this.state.cardSymbolsInRand[this.state.secondPickedIndex]
  
      if (firstSymbol != secondSymbol) {
        // Incorrect
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

  multiplierSubtract = () => {
    if (this.state.multiplier === 2) {
      return;
    }

    let buttonSize

    if (this.state.multiplier === 4) {
      buttonSize = 140
      fontSize = 80
    } else if (this.state.multiplier === 6) {
      buttonSize = 80
      fontSize = 46
    } else if (this.state.multiplier === 8) {
      buttonSize = 40
      fontSize = 30
    } else if (this.state.multiplier == 10) {
      buttonSize = 34
      fontSize = 22
    } else {
      buttonSize = 48
      fontSize = 30
    }

    this.setState({
      multiplier: this.state.multiplier - 2,
      buttonSize,
      fontSize,
    })
  }

  multiplierAdd = () => {
    if (this.state.multiplier >= 10) {
      return;
    }

    let buttonSize

    if (this.state.multiplier === 2) {
      buttonSize = 80
      fontSize = 46
    } else if (this.state.multiplier == 6) {
      buttonSize = 40
      fontSize = 30
    } else if (this.state.multiplier == 8) {
      buttonSize = 34
      fontSize = 22
    } else {
      buttonSize = 48
      fontSize = 30
    }

    this.setState({
      multiplier: this.state.multiplier + 2,
      buttonSize,
      fontSize,
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

            <View style={ styles.multiplier_container }>
              <TouchableOpacity style={ styles.multiplier_button } onPress={ this.multiplierSubtract }>
                <Text style={ styles.buttonText }>-</Text>
              </TouchableOpacity>

              <Text style={ styles.multiplier_text }>
                {this.state.multiplier} x {this.state.multiplier}
              </Text>

              <TouchableOpacity style={ styles.multiplier_button } onPress={ this.multiplierAdd }>
                <Text style={ styles.buttonText }>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={ styles.main }>
            <View style={{ ...styles.gameBoard }}>
              {this.state.cardSymbolsInRand.map((symbol, index) => 
                <Card key={index} style={{ ...styles.button, width: this.state.buttonSize, height: this.state.buttonSize, margin: (Dimensions.get('window').width - (this.state.buttonSize * this.state.multiplier)) / (this.state.multiplier * 2) }} onPress={ () => this.cardPressHandler(index) } fontSize={this.state.fontSize} title={symbol} cover="❓" isShow={this.state.isOpen[index]}></Card>
              )}
            </View>
          </View>
          <View style={ styles.footer }>
            <Text style={ styles.footerText }>
              {this.state.isEnded
                ? `Congrats! You have completed in ${this.state.steps} steps.`
                : `You have tried ${this.state.steps} time(s).`
              }
            </Text>
            {this.state.isEnded ?
              <TouchableOpacity onPress={ this.resetGame } style={ styles.tryAgainButton }>
                <Text style={ styles.tryAgainButtonText }>Try Again</Text>
              </TouchableOpacity>
            : null }
          </View>
        </SafeAreaView>
      </>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
  },
  main: {
    flex: 3,
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 20,
    textAlign: 'center',
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
  },
  multiplier_container: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 20,
  },
  multiplier_text: {
    fontSize: 38,
    paddingLeft: 20,
    paddingRight: 20,
  },
  multiplier_button: {
    backgroundColor: '#eee',
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  }
})

export default App 
