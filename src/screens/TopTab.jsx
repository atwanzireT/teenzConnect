import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './HomeScreen';
import InspireScreen from './InspireScreen';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Inspire" component={InspireScreen} />
        </Tab.Navigator>
    )
}