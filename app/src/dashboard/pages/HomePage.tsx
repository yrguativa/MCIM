import React, { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
    Home,
    Users,
    Calendar,
    Compass,
    CheckSquare,
    Search,
    Settings,
    Bell,
    Play,
    TrendingUp,
    Code,
    Palette,
    Clock,
    Target,
    BookOpen
} from 'lucide-react';

type CircularProgressProps = {
    value: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
};

const CircularProgress = ({ value, size = 80, strokeWidth = 8, color = '#10b981' }: CircularProgressProps) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-gray-700"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg">{value}h</span>
            </div>
        </div>
    );
};

const categories = [
    { name: 'All', active: true },
    { name: 'Popular', icon: '🔥' },
    { name: 'Design', icon: '🎨' },
    { name: 'Management', icon: '📈' },
    { name: 'Innovation', icon: '🚀' },
    { name: 'Growth', icon: '📊' },
    { name: 'Collaboration', icon: '🤝' },
    { name: 'Research', icon: '🔍' },
    { name: 'Communication', icon: '💬' },
    { name: 'Sustainability', icon: '🌱' },
    { name: 'Tech', icon: '💻' }
];

const studyCards = [
    {
        title: 'Innovation',
        instructor: 'Henri Brosman',
        members: 45,
        progress: { completed: 42, total: 20 },
        color: 'bg-purple-400',
        avatars: ['👩‍💼', '👨‍💻', '👩‍🎓']
    },
    {
        title: 'Collaboration',
        instructor: 'Henri Brosman',
        members: 42,
        progress: { completed: 42, total: 20 },
        color: 'bg-blue-400',
        avatars: ['👨‍💼', '👩‍💻', '👨‍🎓']
    },
    {
        title: 'Research',
        instructor: 'Henri Brosman',
        members: 18,
        progress: { completed: 42, total: 20 },
        color: 'bg-green-400',
        avatars: ['👩‍🔬', '👨‍🔬', '👩‍💻']
    },
    {
        title: 'Growth',
        instructor: 'Henri Brosman',
        members: 15,
        progress: { completed: 42, total: 20 },
        color: 'bg-gray-400',
        avatars: ['👨‍💼', '👩‍💼', '👨‍💻']
    }
];

const HomePage: FC = () => {

    const [activeTab, setActiveTab] = useState('All');



    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-300 via-purple-200 to-pink-200">
            <div className="max-w-7xl mx-auto p-4">
                {/* Header */}
                <div className="bg-gray-900 rounded-2xl mb-6 p-4">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-600 p-2 rounded-lg">
                                <div className="text-white font-bold">M</div>
                            </div>
                            <span className="text-white font-semibold text-xl">Mindzy</span>
                        </div>

                        <nav className="flex items-center space-x-6">
                            <Button variant="ghost" className="text-gray-300 hover:text-white">
                                <Home className="w-4 h-4 mr-2" />
                                Home
                            </Button>
                            <Button variant="ghost" className="text-gray-300 hover:text-white">
                                <Users className="w-4 h-4 mr-2" />
                                Community
                            </Button>
                            <Button variant="ghost" className="text-gray-300 hover:text-white">
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule
                            </Button>
                            <Button variant="ghost" className="text-gray-300 hover:text-white">
                                <Compass className="w-4 h-4 mr-2" />
                                Explore
                            </Button>
                            <Button variant="ghost" className="text-gray-300 hover:text-white">
                                <CheckSquare className="w-4 h-4 mr-2" />
                                Tasks
                            </Button>
                        </nav>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-300">
                                <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-300">
                                <Bell className="w-4 h-4" />
                            </Button>
                            <Avatar>
                                <AvatarImage src="/placeholder-avatar.jpg" />
                                <AvatarFallback>BJ</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    {/* Welcome Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-white text-2xl font-bold flex items-center">
                                Hi, 👋 Ben Johnson
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Search"
                                    className="bg-gray-800 border-gray-700 text-white pl-10 w-64"
                                />
                            </div>
                            <Button variant="ghost" size="sm" className="text-gray-300">
                                <Settings className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Categories
                    <div className="flex items-center space-x-3 mt-6 flex-wrap">
                        {categories.map((category, index) => (
                            <Button
                                key={index}
                                variant={category.name === activeTab ? "default" : "ghost"}
                                size="sm"
                                className={`${category.name === activeTab
                                    ? "bg-white text-black"
                                    : "text-gray-300 hover:text-white"
                                    } flex items-center space-x-2`}
                                onClick={() => setActiveTab(category.name)}
                            >
                                {category.icon && <span>{category.icon}</span>}
                                <span>{category.name}</span>
                            </Button>
                        ))}
                    </div> */}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column */}
                    <div className="col-span-3 space-y-4">
                        {/* Study Overview */}
                        <Card className="bg-purple-400 text-white border-0">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-sm">Study Overview</span>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Study Quality */}
                        <Card className="bg-gray-800 text-white border-0">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="text-sm">Study Quality</span>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Day Streak */}
                        <Card className="bg-gradient-to-br from-pink-400 to-red-400 text-white border-0">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="text-sm opacity-90">Day Streak</p>
                                        <p className="text-3xl font-bold">21</p>
                                    </div>
                                    <div className="bg-white/20 rounded-full p-2">
                                        <div className="text-green-300 text-sm">+5%</div>
                                    </div>
                                </div>
                                <div className="text-xs opacity-75">5/12</div>
                            </CardContent>
                        </Card>

                        {/* Points */}
                        <Card className="bg-gradient-to-br from-blue-400 to-cyan-400 text-white border-0">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="text-sm opacity-90">Points</p>
                                        <p className="text-3xl font-bold">1920</p>
                                    </div>
                                    <div className="bg-white/20 rounded-full p-2">
                                        <div className="text-green-300 text-sm">+12%</div>
                                    </div>
                                </div>
                                <div className="text-xs opacity-75">2/8</div>
                            </CardContent>
                        </Card>

                        {/* Week Challenge */}
                        <Card className="bg-gray-900 text-white border-0">
                            <CardHeader>
                                <CardTitle className="text-sm">Week Challenge</CardTitle>
                                <div className="text-xs text-gray-400">1 week left ⏰</div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-7 gap-2 mb-4">
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                        <div key={index} className="text-center">
                                            <div className="text-xs text-gray-400 mb-1">{day}</div>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${index < 5 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
                                                }`}>
                                                {27 + index}
                                            </div>
                                            <div className="text-xs mt-1 text-gray-400">
                                                {index < 3 ? '130' : index < 5 ? '88' : '32'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Skills */}
                        <div className="space-y-3">
                            <Card className="bg-gray-900 text-white border-0 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Code className="w-5 h-5" />
                                        <div>
                                            <p className="font-medium">Engineering</p>
                                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                                <span>🔥 8h</span>
                                                <span>❤️ 200p</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-green-400 font-bold">71%</div>
                                </div>
                            </Card>

                            <Card className="bg-gray-900 text-white border-0 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Palette className="w-5 h-5" />
                                        <div>
                                            <p className="font-medium">Graphic Design</p>
                                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                                                <span>🔥 8h</span>
                                                <span>❤️ 200p</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-pink-400 font-bold">32%</div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Middle Column */}
                    <div className="col-span-6 space-y-4">
                        {/* Study Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            {studyCards.map((card, index) => (
                                <Card key={index} className={`${card.color} text-white border-0 relative overflow-hidden`}>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-lg">{card.title}</h3>
                                            <Button size="sm" className="bg-black/20 hover:bg-black/30 border-0">
                                                <Play className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className="flex -space-x-2">
                                                {card.avatars.map((avatar, i) => (
                                                    <div key={i} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
                                                        {avatar}
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-xs">+{card.members} Members</span>
                                        </div>

                                        <p className="text-sm opacity-90 mb-3">{card.instructor}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="text-sm">
                                                <span className="font-bold">{card.progress.completed}h</span>
                                                <span className="opacity-75"> {card.progress.total}h</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Study Flow */}
                        <Card className="border-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Study Flow</CardTitle>
                                    <Button variant="ghost" size="sm">
                                        <Settings className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex space-x-4 text-sm">
                                    <span className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>Growth</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                        <span>Failings</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                        <span>Missing</span>
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-center space-x-8">
                                    {/* <CircularProgress value={34} color="#10b981" />
                                    <CircularProgress value={12} color="#ec4899" />
                                    <CircularProgress value={12} color="#6b7280" /> */}
                                </div>

                                <div className="mt-6">
                                    <Progress value={70} className="h-3" />
                                    <div className="flex justify-between mt-2 text-sm">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>Done: 3 lessons</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                            <span>Failed: 8 lessons</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>In process: 9 lessons</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                            <span>Missed: 3 lessons</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Management Card */}
                        <Card className="bg-gradient-to-r from-blue-400 to-purple-400 text-white border-0">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-white/20 p-2 rounded">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">Management</h3>
                                            <p className="text-sm opacity-90">May Haggeto</p>
                                            <div className="flex items-center space-x-2 text-xs">
                                                <div className="flex -space-x-1">
                                                    {[1, 2, 3].map(i => (
                                                        <div key={i} className="w-4 h-4 bg-white/30 rounded-full"></div>
                                                    ))}
                                                </div>
                                                <span>+12 Members</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button size="sm" className="bg-black/20 hover:bg-black/30 border-0">
                                        <Play className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="col-span-3 space-y-4">
                        {/* Weekly Activity */}
                        <Card className="bg-gray-900 text-white border-0">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm">Weekly activity</CardTitle>
                                    <select className="bg-transparent text-xs border-none">
                                        <option>Week</option>
                                    </select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center mb-4">
                                    <div className="text-2xl font-bold">15h 43m</div>
                                    <div className="text-xs text-gray-400">76% activity • 5% projects</div>
                                </div>

                                <div className="relative w-32 h-32 mx-auto mb-4">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-700" />
                                        <circle cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 56 * 0.4} ${2 * Math.PI * 56}`} strokeLinecap="round" />
                                        <circle cx="64" cy="64" r="48" stroke="#ec4899" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 48 * 0.19} ${2 * Math.PI * 48}`} strokeLinecap="round" />
                                        <circle cx="64" cy="64" r="40" stroke="#6366f1" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 40 * 0.4} ${2 * Math.PI * 40}`} strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-lg font-bold">1920</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                                            <span>Procrastination</span>
                                        </div>
                                        <span>19%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span>Activity</span>
                                        </div>
                                        <span>41%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <span>Studying</span>
                                        </div>
                                        <span>40%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Roadmap */}
                        <Card className="border-0">
                            <CardHeader>
                                <CardTitle className="text-sm">Roadmap</CardTitle>
                                <div className="grid grid-cols-4 gap-1 text-xs">
                                    <span className="font-medium">D</span>
                                    <span className="font-medium">W</span>
                                    <span className="font-medium">M</span>
                                    <span className="font-medium">Y</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">D</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="text-sm">Review 50%</div>
                                        <div className="flex items-center justify-between">
                                            <Progress value={50} className="flex-1 mr-2" />
                                            <Avatar className="w-6 h-6">
                                                <AvatarFallback className="text-xs">U</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-100 rounded-lg p-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="bg-green-500 rounded p-1">
                                                <BookOpen className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm font-medium">Done 100%</span>
                                        </div>
                                        <span className="text-xs text-gray-600">Weekend</span>
                                    </div>
                                </div>

                                {/* Calendar */}
                                <div className="grid grid-cols-7 gap-1 text-xs">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                        <div key={index} className="text-center text-gray-500 py-1">{day}</div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;