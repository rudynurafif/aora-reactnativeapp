import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { searchPosts } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useLocalSearchParams } from 'expo-router';

const Search = () => {
  const { query } = useLocalSearchParams();
  const {
    data: posts,
    isLoading,
    refetch,
  } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className='bg-primary h-full'>
      {isLoading ? (
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size='large' color='#fff' />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => <VideoCard video={item} />}
          ListHeaderComponent={() => (
            <>
              <View className='flex my-6 px-4'>
                <Text className='font-pmedium text-gray-100 text-sm'>
                  Search Results
                </Text>
                <Text className='text-2xl font-psemibold text-white mt-1'>
                  "{query}"
                </Text>

                <View className='mt-6 mb-8'>
                  <SearchInput initialQuery={query} refetch={refetch} />
                </View>
              </View>
            </>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title='No Videos Found'
              subtitle={`No videos found for the search of "${query}"`}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Search;
