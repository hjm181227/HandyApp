import { Text, View, ScrollView, Image, Dimensions } from "react-native";

export interface Item {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const ItemScrollBanner = ({ items, title }: { items: Item[], title: string }) => {
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 96) / 2; // 2 columns with padding

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        marginLeft: 4,
        paddingHorizontal: 16,
      }}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {items.map((item) => (
            <View
              key={item.id}
              style={{
                width: itemWidth,
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: 8,
                padding: 12,
                overflow: 'hidden',
                backgroundColor: 'white'
              }}
            >
              <Image
                source={require('../assets/images/nail1.png')}
                style={{
                  width: itemWidth - 24,
                  height: itemWidth - 24,
                  borderRadius: 8,
                }}
              />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: '500',
                }}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#666',
                  marginTop: 4,
                }}
              >
                {item.price.toLocaleString()}원
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default ItemScrollBanner;
