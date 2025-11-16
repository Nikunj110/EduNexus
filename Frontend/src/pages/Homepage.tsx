import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, Users, BookOpen, TrendingUp } from 'lucide-react';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Welcome to Modern Education
              </span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Education Management
              <span className="block text-primary mt-2">Simplified</span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Streamline education management, class organization, and add students and faculty.
              Seamlessly track attendance, assess performance, and provide feedback.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/choose" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 transition-all shadow-lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/chooseasguest" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/20 hover:bg-primary/5">
                  Try as Guest
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/Adminregister" className="text-primary font-medium hover:underline">
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right duration-700">
            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Smart Learning</h3>
                <p className="text-sm text-muted-foreground">
                  Organize classes and manage curriculum efficiently
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mt-8 border-secondary/20">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">User Management</h3>
                <p className="text-sm text-muted-foreground">
                  Add and manage students and faculty with ease
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor attendance and academic performance
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mt-8 border-secondary/20">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Get insights with detailed reports and feedback
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Students', value: '10K+' },
            { label: 'Teachers', value: '500+' },
            { label: 'Courses', value: '100+' },
            { label: 'Success Rate', value: '95%' },
          ].map((stat, index) => (
            <div key={index} className="text-center space-y-2 animate-in fade-in slide-in-from-bottom duration-700" style={{ animationDelay: `${index * 100}ms` }}>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
