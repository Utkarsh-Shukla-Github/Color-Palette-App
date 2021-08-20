import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet, TouchableOpacity, Text} from 'react-native';
import PalettePreview from '../components/PalettePreview';

const Home = ({navigation, route}) => {
  const newColorPalette = route.params
    ? route.params.newColorPalette
    : undefined;
  const [palettes, setPalettes] = useState([]);
  const [isRefrereshing, setIsRefreshing] = useState(false);

  const handleFetchPalettes = useCallback(async () => {
    const response = await fetch(
      'https://color-palette-api.kadikraman.now.sh/palettes',
    );
    if (response.ok) {
      const palettes = await response.json();
      setPalettes(palettes);
    }
  }, []);

  useEffect(() => {
    handleFetchPalettes();
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await handleFetchPalettes();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (newColorPalette) {
      setPalettes(palettes => [newColorPalette, ...palettes]);
    }
  }, [newColorPalette]);
  return (
    <FlatList
      style={styles.list}
      data={palettes}
      keyExtractor={item => item.paletteName}
      renderItem={({item}) => (
        <PalettePreview
          handlePress={() => navigation.navigate('ColorPalette', item)}
          colorPalette={item}
        />
      )}
      refreshing={isRefrereshing}
      onRefresh={() => {
        handleRefresh;
      }}
      // refreshControl={<RefreshControl refreshing={true} onRefresh={() => {}} />}
      ListHeaderComponent={
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ColorPaletteModal');
          }}>
          <Text style={styles.buttonText}>Add a color scheme </Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
    backgroundColor: 'white',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'teal',
    marginBottom: 10,
  },
});

export default Home;
