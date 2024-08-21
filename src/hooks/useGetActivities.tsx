import {useEffect, useState} from 'react';
import {DEV_API_URL} from '@env';

export const useGetActivities = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        (async () => {
            await fetchActivities();
        })();
    }, []);
    const fetchActivities = async () => {
        try {
            const url = `${DEV_API_URL}/achieve/user_id/4`;
            const response = await fetch(url);
            const data = await response.json();
            setActivities(data);
        } catch (e) {
            setError('An error occurred while fetching data');
        }
    };

    if (activities) {
        console.log(activities);
    }

    /*  if (loading) {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        );
      }*/
    return [activities, loading, error];
};
