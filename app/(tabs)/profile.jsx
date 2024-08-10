import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import { getUserPosts, signOut } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import VideoCard from '../../components/VideoCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import { icons } from '../../constants';
import InfoBox from '../../components/InfoBox';
import { router } from 'expo-router';
import { useState } from 'react';

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const {
    data: posts,
    refetch,
    isLoading,
  } = useAppwrite(() => getUserPosts(user.$id));

  const [refresing, setRefresing] = useState(false);

  const onRefresh = async () => {
    setRefresing(true);
    // recall videos -> if any new videos appear
    await refetch();
    setRefresing(false);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace('/sign-in');
  };

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
            <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
              <TouchableOpacity
                className='w-full items-end mb-10'
                onPress={logout}
              >
                <Image
                  source={icons.logout}
                  resizeMode='contain'
                  className='w-6 h-6'
                />
              </TouchableOpacity>

              <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
                <Image
                  source={{ uri: user?.avatar }}
                  className='w-full h-full rounded-lg'
                  resizeMode='cover'
                />
              </View>

              <InfoBox
                title={user?.username}
                containerStyles='mt-5'
                titleStyle='text-lg'
              />

              <View className='mt-5 flex-row'>
                <InfoBox
                  title={posts.length || 0}
                  subtitle='Posts'
                  containerStyles='mr-10'
                  titleStyle='text-xl'
                />
                <InfoBox
                  title='1.2k'
                  subtitle='Followers'
                  titleStyle='text-xl'
                />
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title='No Videos Found'
              subtitle={`No videos found for the search`}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refresing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
