import React, {useState, useCallback, useEffect} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import PalettePreview from '../components/PalettePreview';

const Home = ({navigation}) => {
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
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
    backgroundColor: 'white',
  },
});

export default Home;
