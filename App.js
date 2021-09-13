import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  NativeModules,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import axios from "axios";

// CHAVE DE ACESSO PARA A API
const API_KEY = "66c509e899340f019eec4ee5da6917b9";

// ENDPOINT PARA BUSCAAR LISTA DE FILMES
const URL_ALL_MOVIES =
  "http://api.themoviedb.org/3/list/509ec17b19c2950a0600050d?api_key=66c509e899340f019eec4ee5da6917b9";

// ENDPOINT PARA PESQUISAR FILME POR NOME (EX. ILHA DO MEDO)
const URL_SEARCH_MOVIE =
  "https://api.themoviedb.org/3/search/movie?api_key=66c509e899340f019eec4ee5da6917b9&query=ilhadomedo";

//URL PARA BUCAR IMAGEM/POSTER
const URL_IMAGES = "https://image.tmdb.org/t/p/w500";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function App() {
  const carouselRef = useRef(null);
  const [lista, setLista] = useState([]);
  const [background, setBackground] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [timeOut, setTimeOut] = useState(0);

  // FUNCAO QUE RODA ASSIM QUE O APP É INICIALIZADO OU ATUALIZADO
  //chamando a funcao
  useEffect(() => {
    handleGetFilms();
  }, []);

  // criando metodo
  const handleGetFilms = async () => {
    try {
      const response = await axios.get(
        `http://api.themoviedb.org/3/list/509ec17b19c2950a0600050d?api_key=${API_KEY}`
      );
      //console.log(response.data.items);
      setLista(response.data.items);
      setBackground(`https://image.tmdb.org/t/p/w500${response.data.items[activeIndex].poster_path}`)

    } catch (error) {
      Alert.alert("eai", "Erro");
    }
  };

  const handleTimeSearch = async (text) => {
    clearTimeout(timeOut);
    setTimeOut(
      setTimeout(() => {
        handleSearch(text);
      }, 900)
    );
  };

  // funcao de pesquisar filme, falta fazer a chamada na API
  const handleSearch = async (text) => {
    try {
      if (text) {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${text}`
        );
        setLista(response.data.results);
        setBackground(`https://image.tmdb.org/t/p/w500${response.data.results[activeIndex].poster_path}`)
      }
    } catch (error) {
      // console.log(error);
      Alert.alert("eai", "Erro");
    }
  };

  const handleSnapItem = (index) => {
    setActiveIndex(index);
    // FALTA INSERIR A IMAGEM DE FUNDO
    setBackground(`https://image.tmdb.org/t/p/w500${lista[index].poster_path}`);
  };

  // RENDERIZACAO DE CADA ITEM DA LISTA, PEGANDO AS IMAGENS DO ENDPOINT
  const _renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
            }}
            style={styles.carouselImg}
          />
          <Text style={styles.carouselText}>{item.title}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, height: screenHeight }}>
        <View style={{ ...StyleSheet.absoluteFill, backgroundColor: "#000" }}>
          <ImageBackground
            source={{ uri: background }}
            style={[
              styles.imgBg,
              {
                paddingTop:
                  Platform.OS === "ios" ? 44 : StatusBar.currentHeight,
              },
            ]}
            blurRadius={12}
          >
            <View style={styles.viewSearch}>
              <TextInput
                onChangeText={handleTimeSearch}
                style={styles.input}
                placeholder="Pesquise aqui"
              />
            </View>

            <View style={styles.slideView}>
              <Carousel
                style={styles.carousel}
                ref={carouselRef}
                data={lista}
                renderItem={_renderItem}
                sliderWidth={screenWidth}
                itemWidth={200}
                inactiveSlideOpacity={0.5}
                onSnapToItem={(index) => {
                  handleSnapItem(index);
                }}
              />
            </View>

            <View style={styles.moreInfo}>
              <View style={{  padding: 20 }}>
                <Text style={styles.movieTitle}>
                  {lista[activeIndex]?.title}
                </Text>
                <ScrollView >
                 <Text style={styles.movieDesc}>{lista[activeIndex]?.overview}</Text>
                </ScrollView>
              </View>
            </View>
          </ImageBackground>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBg: {
    flex: 1,
    width: null,
    height: null,
    opacity: 1,
    justifyContent: "flex-start",
    backgroundColor: "#000",
  },
  viewSearch: {
    marginTop: 20,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#fff",
    elevation: 10,
    borderRadius: 5,
    marginVertical: 10,
    flexDirection: "row",
  },
  input: {
    width: "95%",
    padding: 13,
    paddingLeft: 20,
    fontSize: 17,
    color: "#000",
  },
  slideView: {
    width: "100%",
    height: 350,
    justifyContent: "center",
    alignItems: "center",
  },
  carousel: {
    flex: 1,
    overflow: "visible",
  },
  carouselImg: {
    alignSelf: "center",
    width: 200,
    height: 300,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  carouselText: {
    padding: 15,
    color: "#fff",
    position: "absolute",
    bottom: 15,
    left: 2,
    fontWeight: "bold",
  },
  moreInfo: {
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    width: screenWidth,
    borderTopRightRadius: 2,
    borderTopLeftRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    maxHeight: 170,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  movieDesc: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
