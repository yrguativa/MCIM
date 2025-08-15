import React, { FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
    Home,
    Users,
    Calendar,
    Compass,
    CheckSquare,
    Search,
    Settings,
    Bell,

} from 'lucide-react';





const  HomePage: FC = () => {

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



                </div>
            </div>
        </div>
    );
};

export default HomePage;