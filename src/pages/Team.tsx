import React, { useEffect, useState } from 'react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { Users, ChevronRight, ChevronDown, DollarSign, User } from 'lucide-react';
import { getTeamData } from '../utils/api/team';
import { formatDate } from '../utils/helper';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  investment: number;
  teamSize: number;
  directBusiness: number;
  totalBusiness: number,
  teamEarnings: number;
  createdAt: Date;
  level: number;
  children?: TeamMember[];
  refferrer?: TeamMember[];
}

const Team: React.FC = () => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1', '6']));
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tilesData, setTilesData] = useState({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data: any = await getTeamData();
        setTeam(data?.data?.team);
        setTilesData(data.data.userData);
      } catch (err) {
        console.error("Failed to load team:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getLevelColor = (level: number) => {
    const colors = {
      1: 'text-yellow-400 bg-yellow-400/20',
      2: 'text-blue-400 bg-blue-400/20',
      3: 'text-green-400 bg-green-400/20',
      4: 'text-purple-400 bg-purple-400/20',
      5: 'text-pink-400 bg-pink-400/20',
    };
    return colors[level as keyof typeof colors] || 'text-gray-400 bg-gray-400/20';
  };

  const getLevelCommission = (level: number) => {
    return level === 1 ? '10%' : '5%';
  };
  const renderTeamMember = (member: TeamMember) => {
    const isExpanded = expandedNodes.has(member.id);
    const hasChildren = member.children && member.children.length > 0;

    return (
      <div key={member.id} className="ml-2 sm:ml-4">
        <div
          className={`flex flex-col sm:flex-row sm:items-center sm:space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200
          ${selectedMember?.id === member.id
              ? 'bg-yellow-400/20 border border-yellow-400/50'
              : 'bg-gray-700 hover:bg-gray-600'}
        `}
          onClick={() => setSelectedMember(member)}
        >
          {/* Expand / Collapse Button */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(member.id);
              }}
              className="text-gray-400 hover:text-white self-start sm:self-center"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          ) : (
            <div className="w-4 h-4"></div>
          )}

          {/* Level Badge */}
          <div
            className={`px-2 py-1 rounded text-xs sm:text-sm font-semibold ${getLevelColor(
              member.level
            )}`}
          >
            {member.level}
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-sm sm:text-base font-bold text-white">
            {member.name.charAt(0)}
          </div>

          {/* Name + Email */}
          <div className="flex-1 min-w-0 mt-2 sm:mt-0">
            <p className="text-white font-medium text-sm sm:text-base truncate">
              {member.name}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm truncate">
              {member.email}
            </p>
          </div>

          {/* Investment & Team */}
          <div className="text-left sm:text-right mt-2 sm:mt-0">
            <p className="text-white font-semibold text-sm sm:text-base">
              ${member.investment}
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">{member.teamSize} team</p>
          </div>

          {/* Commission */}
          <div className="text-left sm:text-right mt-2 sm:mt-0">
            <p className="text-gray-400 text-xs sm:text-sm">
              {getLevelCommission(member.level)} comm.
            </p>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-2 border-l-2 border-gray-600 ml-2 pl-2">
            {member.children!.map(renderTeamMember)}
          </div>
        )}
      </div>
    );
  };


  if (loading) return <p>Loading team...</p>;


  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Team Network</h1>
            <p className="text-gray-400 mt-2">Manage and track your referral network</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Team Investment</p>
                <p className="text-2xl font-bold text-white">${tilesData.totalTeamInvestments || 0}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Team Size</p>
                <p className="text-2xl font-bold text-white">{tilesData.myNetwork || 0}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Team Earnings</p>
                <p className="text-2xl font-bold text-white">${tilesData?.teamEarnings || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Team Tree */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Network Structure</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setExpandedNodes(new Set(team.map(m => m.id)))}
                  >
                    Expand All
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setExpandedNodes(new Set())}
                  >
                    Collapse All
                  </Button>
                </div>
              </div>

              {/* Level Legend */}
              <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-700 rounded-lg">
                {[1, 2, 3, 4, 5].map(level => (
                  <div key={level} className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${getLevelColor(level)}`}>
                      L{level}
                    </div>
                    <span className="text-gray-300 text-sm">
                      {level === 1 ? 'Direct' : `Level ${level}`} ({getLevelCommission(level)})
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {team.map(renderTeamMember)}
              </div>
            </Card>
          </div>

          {/* Member Details */}
          <div>
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Member Details</h3>

              {selectedMember ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-60 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 mx-auto mb-3">
                      {selectedMember?.name.charAt(0)}
                    </div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getLevelColor(selectedMember.level)}`}>
                      Level {selectedMember.level}
                    </div>
                    <h4 className="text-lg font-semibold text-white">{selectedMember.name}</h4>
                    <p className="text-gray-400">{selectedMember.email}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Phone</span>
                        <span className="text-white font-semibold">{selectedMember.phone}</span>
                      </div>
                    </div>
                     <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Investment</span>
                        <span className="text-white font-semibold">${selectedMember.investment}</span>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Team Size</span>
                        <span className="text-white font-semibold">{selectedMember.teamSize}</span>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Earnings</span>
                        <span className="text-green-400 font-semibold">${selectedMember.teamEarnings}</span>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Commission Rate</span>
                        <span className="text-yellow-400 font-semibold">{getLevelCommission(selectedMember.level)}</span>
                      </div>
                    </div>

                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Joined Date</span>
                        <span className="text-white">  {formatDate(selectedMember.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* <div className="pt-4 border-t border-gray-600">
                    <h5 className="text-white font-semibold mb-2">Quick Actions</h5>
                    <div className="space-y-2">
                      <Button variant="secondary" size="sm" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        View Full Profile
                      </Button>
                    </div>
                  </div> */}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Select a team member to view details</p>
                </div>
              )}
            </Card>

            {/* Commission Structure */}
            <Card>
              <h3 className="text-xl font-semibold text-white mb-4">Commission Structure</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/30">
                  <span className="text-yellow-400 font-semibold">Level 1 (Direct)</span>
                  <span className="text-yellow-400 font-bold">10%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-400/10 rounded-lg border border-blue-400/30">
                  <span className="text-blue-400 font-semibold">Level 2</span>
                  <span className="text-blue-400 font-bold">5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-400/10 rounded-lg border border-green-400/30">
                  <span className="text-green-400 font-semibold">Level 3</span>
                  <span className="text-green-400 font-bold">5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-400/10 rounded-lg border border-purple-400/30">
                  <span className="text-purple-400 font-semibold">Level 4</span>
                  <span className="text-purple-400 font-bold">5%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-pink-400/10 rounded-lg border border-pink-400/30">
                  <span className="text-pink-400 font-semibold">Level 5</span>
                  <span className="text-pink-400 font-bold">5%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;