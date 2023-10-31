import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import HomeScreen from './HomeScreen';
import InspireScreen from './InspireScreen';

const Tab = createMaterialTopTabNavigator();

export default function TopTabs() {
    return (
        <Tab.Navigator screenOptions={{style: {height: 0}}}>
            <Tab.Screen name="Home" component={HomeScreen} options={{tabBarShowLabel:false}} />
            <Tab.Screen name="Inspire" component={InspireScreen} options={{tabBarShowLabel:false}}/>
        </Tab.Navigator>
    )
}