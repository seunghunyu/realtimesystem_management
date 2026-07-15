import { act, useState } from "react";
import svgPaths from "../imports/svg-svkvdgwod6";
import {
  Search,
  Dashboard,
  Task,
  Folder,
  Calendar,
  UserMultiple,
  Analytics,
  DocumentAdd,
  Settings,
  User,
  ChevronDown,
  ChevronRight,
  OverflowMenuHorizontal,
  CheckmarkOutline,
  Time,
  InProgress,
  Pending,
  Archive,
  Flag,
  AddLarge,
  Filter,
  Renew,
  View,
  Report,
  Share,
  CloudUpload,
  Notification,
  Security,
  Integration,
  StarFilled,
  Group,
  Calendar as CalendarIcon,
  Home,
  ChartBar,
  FolderOpen,
  ChevronLeft,
  ChevronUp,
  IbmLpa,
  SettingsEdit,
  DataBlob,
  IbmEngineeringSystemsDesignRhapsody,ItemUsage,TaskApproved
} from "@carbon/icons-react";
import { CampManagement } from "./CampManagement";
import { AnalyticsDashboard } from "./AnalyticsDashboard";
import { CampApprovalList } from "./CampApprovalList";
import { ItemManagement } from "./ItemManagement";
import { ItemCodeMappingManagement } from "./ItemCodeMappingManagement";
import { FilterConditionManagement } from "./FilterConditionManagement";
import { DataFormatManagement } from "./DataFormatManagement";
import { SystemVarManagement } from "./SystemVarManagement";
import { UserManagement } from "./UserManagement";
import { CampBuilder } from "./CampBuilder";


// Softer spring animation curve
const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

function InterfacesLogo1() {
  return (
    <div
      className="aspect-[24/24] basis-0 grow min-h-px min-w-px overflow-clip relative shrink-0"
      data-name="Interfaces Logo"
    >
      <div
        className="absolute aspect-[24/16] left-0 right-0 top-1/2 translate-y-[-50%]"
        data-name="Union"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          role="presentation"
          viewBox="0 0 24 16"
        >
          <g id="Union">
            <path
              d={svgPaths.p36880f80}
              fill="var(--fill-0, #FAFAFA)"
              style={{
                fill: "color(display-p3 0.9804 0.9804 0.9804)",
                fillOpacity: "1",
              }}
            />
            <path
              d={svgPaths.p355df480}
              fill="var(--fill-0, #FAFAFA)"
              style={{
                fill: "color(display-p3 0.9804 0.9804 0.9804)",
                fillOpacity: "1",
              }}
            />
            <path
              d={svgPaths.pfa0d600}
              fill="var(--fill-0, #FAFAFA)"
              style={{
                fill: "color(display-p3 0.9804 0.9804 0.9804)",
                fillOpacity: "1",
              }}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div
      className="bg-[#000000] relative rounded-[999px] shrink-0 size-8"
      data-name="Avatar"
    >
      <div className="box-border content-stretch flex flex-row items-center justify-center overflow-clip p-0 relative size-8">
        <User size={16} className="text-neutral-50" />
      </div>
      <div
        aria-hidden="true"
        className="absolute border border-neutral-800 border-solid inset-0 pointer-events-none rounded-[999px]"
      />
    </div>
  );
}

function SearchContainer({
  isCollapsed = false,
}: {
  isCollapsed?: boolean;
}) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
      data-name="Search Container"
    >
      <div
        className={`bg-[#000000] h-10 relative rounded-lg flex items-center transition-all duration-500 ${
          isCollapsed
            ? "w-10 min-w-10 justify-center"
            : "w-full"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition-all duration-500 ${
            isCollapsed ? "p-1" : "px-1"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="size-8 flex items-center justify-center">
            <Search size={16} className="text-neutral-50" />
          </div>
        </div>
        <div
          className={`flex-1 min-h-px min-w-px relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="flex flex-col justify-center relative size-full">
            <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center pl-0 pr-2 py-1 relative w-full">
              <input
                type="text"
                placeholder="Search tasks, projects..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-['Lexend:Regular',_sans-serif] font-normal text-[14px] text-neutral-50 placeholder:text-neutral-400 leading-[20px]"
                tabIndex={isCollapsed ? -1 : 0}
              />
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute border border-neutral-800 border-solid inset-0 pointer-events-none rounded-lg"
        />
      </div>
    </div>
  );
}

interface DetailSidebarProps {
  activeSection: string;       // 대분류 (예: "dashboard")
  // currentSubSection: string;   // 👈 현재 선택된 서브 메뉴 ID 상태 (예: "campaign-management")
  // onSubSectionChange: (id: string) => void; // 👈 서브 메뉴가 클릭되었을 때 부모 상태를 바꿀 함수
}

interface MenuItem {
  id: string;
  icon?: React.ReactNode; // menu item에 아이콘이 없을 수 있음
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: MenuItem[];
  // onSectionChange?: (id: string) => void; // 👈 클릭 시 호출되는 함수
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  currentSubSection?: string;
  onItemClick?: (id: string) => void;
}

interface SidebarContent {
  title: string;
  sections: MenuSection[];
}

function MenuItem({
  item,
  isExpanded,
  onToggle,
  onItemClick,
  isCollapsed,
  isActive,
  // onSectionChange, // 👈 추가된 프롭스
}: {
  item: MenuItem;
  isExpanded?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
  isCollapsed?: boolean;
  isActive?: boolean;
  // onSectionChange?: (id: string) => void; // 👈 추가된 프롭스
}) {
  const handleClick = () => {
    if (item.hasDropdown && onToggle) {
      onToggle();
    } else if (onItemClick) {
      onItemClick();
    }
  };

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`select-none rounded-lg cursor-pointer transition-all duration-500 flex items-center relative my-0.5 ${
          isActive
            ? "bg-neutral-900"
            : "hover:bg-neutral-900"
        } ${
          isCollapsed
            ? "w-10 min-w-10 h-10 justify-center p-4"
            : "w-full h-10 px-4 py-2"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="flex items-center justify-center shrink-0">
          {item.icon}
        </div>
        <div
          className={`flex-1 min-h-px min-w-px relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="flex flex-col justify-center relative size-full">
            <div className="font-['Lexend:Regular',_sans-serif] font-normal text-[14px] text-neutral-50 leading-[20px] truncate">
              {item.label}
            </div>
          </div>
        </div>
        {item.hasDropdown && (
          <div
            className={`flex items-center justify-center shrink-0 transition-opacity duration-500 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2"
            }`}
            style={{
              transitionTimingFunction: softSpringEasing,
            }}
          >
            <ChevronDown
              size={16}
              className={`text-neutral-50 transition-transform duration-500`}
              style={{
                transitionTimingFunction: softSpringEasing,
                transform: isExpanded
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SubMenuItem({
  item,
  onItemClick,
}: {
  item: MenuItem;
  onItemClick?: () => void;
}) {
  return (
    <div className="select-none w-full pl-9 pr-1 py-[1px]">
      <div
        className="h-10 w-full rounded-lg cursor-pointer transition-colors hover:bg-neutral-900 flex items-center px-3 py-1"
        onClick={onItemClick}
      >
        <div className="flex-1 min-w-0">
          <div className="font-['Lexend:Regular',_sans-serif] font-normal text-[14px] text-neutral-300 leading-[18px] truncate">
            {item.label}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuSection({
  section,
  activeSubSection,
  expandedItems,
  onToggleExpanded,
  isCollapsed,
  onItemClick,
  setSubSectionChange,
}: {
  section: MenuSection;
  activeSubSection: string;
  expandedItems: Set<string>;
  onToggleExpanded: (itemKey: string) => void;
  isCollapsed?: boolean;
  onItemClick?: (id: string) => void;
  setSubSectionChange?: (id: string) => void; // 👈 추가된 프롭스
}) {
  return (
    <div className="box-border content-stretch flex flex-col items-start justify-stretch p-0 relative shrink-0 w-full">
      <div
        className={`relative shrink-0 w-full transition-all duration-500 overflow-hidden ${
          isCollapsed ? "h-0 opacity-0" : "h-10 opacity-100"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div className="flex flex-col justify-center relative size-full">
          <div className="box-border content-stretch flex flex-col h-10 items-start justify-center p-[16px] relative w-full">
            <div className="font-['Lexend:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[14px] text-left text-neutral-400 text-nowrap">
              <p className="block leading-[20px] whitespace-pre">
                {section.title}
              </p>
            </div>
          </div>
        </div>
      </div>
      {section.items.map((item, index) => {
        const itemKey = `${section.title}-${index}`;
        const isExpanded = expandedItems.has(itemKey);
        return (
          <div
            key={itemKey}
            className="w-full flex flex-col content-stretch"
          >
            <MenuItem
              item={item}
              isExpanded={isExpanded}
              onToggle={() => onToggleExpanded(itemKey)}
              // onItemClick={() =>
              //   console.log(`Clicked ${item.label} ,${item.id} `)
              // }
              // 1. 중괄호 { }를 열고 그 안에서 함수들을 실행합니다.
              onItemClick={() => {
                console.log(`Clicked ${item.label} ,${item.id}`);
                
                // 2. MenuSection이 부모에게서 받은 함수를 여기서 호출합니다.
                if (setSubSectionChange) {
                  console.log(`setSubSectionChange = ${item.id}`);
                  setSubSectionChange(item.id);
                }
              }} // 👈 여기서 중괄호와 소괄호를 닫습니다.
              isActive={activeSubSection === item.id}
              isCollapsed={isCollapsed}
            />
            {isExpanded && item.children && !isCollapsed && (
              <div className="flex flex-col gap-1 mb-2">
                {item.children.map((child, childIndex) => (
                  <SubMenuItem
                    key={`${itemKey}-${childIndex}`}
                    item={child}
                    onItemClick={() =>
                      console.log(`Clicked ${child.label}`)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getSidebarContent(
  activeSection: string,
): SidebarContent {
  const contentMap: Record<string, SidebarContent> = {
    dashboard: {
      title: "Dashboard",
      sections: [
        {
          title: "Campaigns",
          items: [
            {
              icon: (
                <IbmLpa size={16} className="text-neutral-50" />
              ),
              id : "campaign-management",
              label: "Campaign Management",
              isActive: true,
            },
            {
              icon: (
                <TaskApproved size={16} className="text-neutral-50" />
              ),
              id : "campaign-approval-list",
              label: "Campaign Approval List",
              isActive: false,
            },
          ],
        },
        {
          title: "Data Management",
          items: [
            {
              icon: (
                <ItemUsage size={16} className="text-neutral-50" />
              ),
              id: "item-management",
              label: "Item Management",
              hasDropdown: false
            },
            {
              icon: (
                <IbmEngineeringSystemsDesignRhapsody size={16} className="text-neutral-50" />
              ),
              id: "item-code-mapping-management",
              label: "Item Code Mapping Management",
              hasDropdown: false
            },
            {
              icon: (
                <Filter size={16} className="text-neutral-50" />
              ),
              id: "filter-condition-management",
              label: "Data Filter Condition Management",
              hasDropdown: false
            },
            {
              icon: (
                <DataBlob size={16} className="text-neutral-50" />
              ),
              id: "data-format-management",
              label: "Data Format Management",
              hasDropdown: false
            },
          ],
        },
        {
          title: "Settings",
          items: [
            {
              icon: (
                <SettingsEdit  size={16} className="text-neutral-50" />
              ),
              id: "system-variable-management",
              label: "System Variable Management",
              hasDropdown: false
            },{
              icon: (
                <Group size={16} className="text-neutral-50" />
              ),
              id: "user-management",
              label: "User Management",
              hasDropdown: false
            },
          ],
        },
      ],
    },analytics: {
      title: "Analytics",
      sections: [
        {
          title: "Insights",
          items: [
            
          ],
        },
      ],
    },
  };

  return contentMap[activeSection] || contentMap.tasks;
}

function IconNavButton({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`box-border content-stretch flex flex-row items-center justify-center overflow-clip p-0 relative rounded-lg shrink-0 size-10 min-w-10 cursor-pointer transition-colors duration-500
        ${
          isActive
            ? "bg-neutral-800 text-neutral-50"
            : "hover:bg-neutral-900 text-neutral-400 hover:text-neutral-300"
        }`}
      style={{ transitionTimingFunction: softSpringEasing }}
      data-name="Icon Nav Button"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function IconNavigation({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: string) => void;
}) {
  const navItems = [
    {
      id: "dashboard",
      icon: <Dashboard size={16} />,
      label: "Dashboard",
    },
    {
      id: "analytics",
      icon: <Analytics size={16} />,
      label: "Analytics",
    },

  ];

  return (
    <div
      className="bg-[#000000] box-border content-stretch flex flex-col gap-2 h-[800px] items-center justify-start overflow-clip p-4 relative rounded-l-2xl shrink-0 w-16 border-r border-neutral-800"
      data-name="Icon Navigation"
    >
      {/* Logo */}
      <div className="mb-2 size-10 flex items-center justify-center">
        <div className="size-7">
          <InterfacesLogo1 />
        </div>
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-2 w-full items-center">
        {navItems.map((item) => (
          <IconNavButton
            key={item.id}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon}
          </IconNavButton>
        ))}
      </div>

      {/* Bottom section */}
      <div className="flex-1" />
      <div className="flex flex-col gap-2 w-full items-center">
        <IconNavButton
          isActive={activeSection === "settings"}
          onClick={() => onSectionChange("settings")}
        >
          <Settings size={16} />
        </IconNavButton>
        <div className="size-8">
          <Avatar />
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  onToggleCollapse,
  isCollapsed,
}: {
  title: string;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}) {
  if (isCollapsed) {
    return (
      <div
        className="relative shrink-0 w-full flex justify-center transition-all duration-500"
        style={{ transitionTimingFunction: softSpringEasing }}
        data-name="Section Title Collapsed"
      >
        <button
          onClick={onToggleCollapse}
          className="box-border content-stretch flex flex-row items-center justify-center overflow-clip p-0 relative rounded-lg shrink-0 cursor-pointer transition-all duration-500 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-300 size-10 min-w-10"
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <ChevronLeft
            size={16}
            className="transition-transform duration-500"
            style={{
              transitionTimingFunction: softSpringEasing,
              transform: "rotate(180deg)",
            }}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative shrink-0 w-full overflow-hidden transition-all duration-500"
      style={{ transitionTimingFunction: softSpringEasing }}
      data-name="Section Title"
    >
      <div className="flex flex-row items-center justify-between relative size-full">
        <div
          className="box-border content-stretch flex flex-row items-center justify-start relative h-10 overflow-hidden transition-opacity opacity-100 duration-500"
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="box-border content-stretch flex flex-col gap-2 items-start justify-center px-2 py-1 relative shrink-0">
            <div className="font-['Lexend:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[18px] text-left text-neutral-50 text-nowrap">
              <p className="block leading-[27px] whitespace-pre">
                {title}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center pr-1">
          <button
            onClick={onToggleCollapse}
            className="box-border content-stretch flex flex-row items-center justify-center overflow-clip p-0 relative rounded-lg shrink-0 cursor-pointer transition-all duration-500 hover:bg-neutral-900 text-neutral-400 hover:text-neutral-300 size-10 min-w-10"
            style={{
              transitionTimingFunction: softSpringEasing,
            }}
          >
            <ChevronLeft
              size={16}
              className="transition-transform duration-500"
              style={{
                transitionTimingFunction: softSpringEasing,
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

// function DetailSidebar({
//   activeSection,
// }: DetailSidebarProps) {
//   const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const content = getSidebarContent(activeSection);

//   const toggleExpanded = (itemKey: string) => {
//     const newExpanded = new Set(expandedItems);
//     if (newExpanded.has(itemKey)) {
//       newExpanded.delete(itemKey);
//     } else {
//       newExpanded.add(itemKey);
//     }
//     setExpandedItems(newExpanded);
//   };

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   return (
//     <div
//       className={`bg-[#000000] box-border content-stretch flex flex-col gap-4 h-[800px] items-start justify-start overflow-visible p-4 relative rounded-r-2xl shrink-0 transition-all duration-500 ${
//         isCollapsed ? "w-16 min-w-16 !px-0 justify-center" : "w-80"
//       }`}
//       style={{ transitionTimingFunction: softSpringEasing }}
//       data-name="Detail Sidebar"
//     >
//       <SectionTitle
//         title={content.title}
//         onToggleCollapse={toggleCollapse}
//         isCollapsed={isCollapsed}
//       />
//       <SearchContainer isCollapsed={isCollapsed} />

//       <div
//         className={`basis-0 box-border content-stretch flex flex-col grow min-h-px min-w-10 p-0 relative shrink-0 w-full overflow-y-auto transition-all duration-500 ${
//           isCollapsed
//             ? "gap-2 items-center justify-start"
//             : "gap-4 items-start justify-start"
//         }`}
//         style={{ transitionTimingFunction: softSpringEasing }}
//       >
//         {content.sections.map((section, index) => (
//           <MenuSection
//             key={`${activeSection}-${index}`}
//             section={section}
//             expandedItems={expandedItems}
//             onToggleExpanded={toggleExpanded}
//             isCollapsed={isCollapsed}
//             // 👈 아래의 프롭스들을 MenuSection 내부로 전달하여 클릭 이벤트와 활성화 스타일을 처리합니다.
//             // currentSubSection={currentSubSection}
//             // onItemClick={onSubSectionChange}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
function DetailSidebar({
  activeSection,
  activeSubSection,
  onSectionChange,
  onSubSectionChange,
  setSubSectionChange,
}: {
  activeSection: string;
  activeSubSection: string;
  onSectionChange: (section: string) => void;
  onSubSectionChange: (section: string) => void;
  setSubSectionChange: (subSection: string) => void;
}) {
  const [expandedItems, setExpandedItems] = useState<
    Set<string>
  >(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const content = getSidebarContent(activeSection);
  const subContent = getSidebarContent(activeSubSection);

  const toggleExpanded = (itemKey: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemKey)) {
      newExpanded.delete(itemKey);
    } else {
      newExpanded.add(itemKey);
    }
    setExpandedItems(newExpanded);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`bg-[#000000] box-border content-stretch flex flex-col gap-4 h-[800px] items-start justify-start overflow-visible p-4 relative rounded-r-2xl shrink-0 transition-all duration-500 ${
        isCollapsed
          ? "w-16 min-w-16 !px-0 justify-center"
          : "w-80"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
      data-name="Detail Sidebar"
    >
      <SectionTitle
        title={content.title}
        onToggleCollapse={toggleCollapse}
        isCollapsed={isCollapsed}
      />
      <SearchContainer isCollapsed={isCollapsed} />

      <div
        className={`basis-0 box-border content-stretch flex flex-col grow min-h-px min-w-10 p-0 relative shrink-0 w-full overflow-y-auto transition-all duration-500 ${
          isCollapsed
            ? "gap-2 items-center justify-start"
            : "gap-4 items-start justify-start"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        {content.sections.map((section, index) => (
          <MenuSection
            key={`${activeSection}-${index}`}
            section={section}
            activeSubSection={activeSubSection}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            isCollapsed={isCollapsed}
            setSubSectionChange={setSubSectionChange}
          />
        ))}
      </div>
    </div>
  );
}

function TwoLevelSidebar({
  activeSection,
  activeSubSection,
  onSectionChange,
  onSubSectionChange,
  setSubSectionChange,
}: {
  activeSection: string;
  activeSubSection: string,
  onSectionChange: (s: string) => void;
  onSubSectionChange: (s: string) => void;
  setSubSectionChange: (subSection: string) => void;
}) {
  return (
    <div
      className="flex flex-row"
      data-name="Two Level Sidebar"
    >
      {/* 1단계 대분류 아이콘 내비게이션 */}
      <IconNavigation
        activeSection={activeSection}
        onSectionChange={onSectionChange}
      />
      
      {/* 2단계 상세 서브 메뉴 사이드바 (주석 해제 후 프롭스 전달) */}
      <DetailSidebar 
        activeSection={activeSection} 
        activeSubSection={activeSubSection}
        onSectionChange={onSectionChange}
        onSubSectionChange={onSubSectionChange}
        setSubSectionChange={setSubSectionChange}
      />
    </div>
  );
}
// function TwoLevelSidebar({
//   activeSection,
//   onSectionChange,
// }: {
//   activeSection: string;
//   onSectionChange: (s: string) => void;
// }) {
//   return (
//     <div
//       className="flex flex-row"
//       data-name="Two Level Sidebar"
//     >
//       <IconNavigation
//         activeSection={activeSection}
//         onSectionChange={onSectionChange}
//       />
//       {/* <DetailSidebar 
//         activeSection={activeSection} 
//       /> */}
//     </div>
//   );
// }

export function Frame760() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [activeSubSection, setActiveSubSection] = useState("campaign-management"); // 서브분류
  // 현재 activeSection 상태에 맞는 메인 화면 콘텐츠를 리턴합니다.
  const renderContent = () => {
    switch (activeSection) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "dashboard":
        if(activeSubSection === "campaign-management") {
          return <CampManagement onNavigateToBuilder={() => setActiveSubSection("campaign-builder")}/>;
        } else if(activeSubSection === "campaign-approval-list") {
          return <CampApprovalList />;
        } else if(activeSubSection === "item-management") {
          return <ItemManagement />;
        } else if(activeSubSection === "item-code-mapping-management") {
          return <ItemCodeMappingManagement />;
        } else if(activeSubSection === "filter-condition-management") {
          return <FilterConditionManagement />;
        } else if(activeSubSection === "data-format-management") {
          return <DataFormatManagement />;
        } else if(activeSubSection === "system-variable-management") {
          return <SystemVarManagement />;
        } else if(activeSubSection === "user-management") {
          return <UserManagement />;
        } else if(activeSubSection === "campaign-builder") { //설계 화면
          return <CampBuilder />;
        }else{
          return <CampManagement />;
        }
      default:    
        return <CampManagement />;
    }
  };
  
  return (
    <div className="bg-[#1a1a1a] box-border content-stretch flex flex-row gap-0 items-start justify-center p-0 relative size-full min-h-screen">
      <TwoLevelSidebar activeSection={activeSection} onSectionChange={setActiveSection} 
                       activeSubSection={activeSubSection} onSubSectionChange={setActiveSubSection} setSubSectionChange={setActiveSubSection}/>
      {/* {activeSection === "analytics" ? <AnalyticsDashboard /> : <CampManagement />} */}
      {renderContent()}
    </div>
  );
}

// export function Frame760() {
//   const [activeSection, setActiveSection] = useState("dashboard");
//   // 초기 상태값을 실제 매핑되는 case 코드("campaign-management")로 유지합니다.
//   const [currentSubSection, setCurrentSubSection] = useState("campaign-management");

//   // 대분류(activeSection)가 아닌 서브 섹션(currentSubSection) 상태에 맞게 메인 화면을 리턴합니다.
//   const renderContent = () => {
//     console.log(currentSubSection)
//     switch (currentSubSection) {
//       case "analytics":
//         return <AnalyticsDashboard />;
//       case "campaign-management":
//         return <CampManagement />;
//       case "campaign-approval":
//         return <CampApprovalList />; 
//       case "item-management":
//         return <ItemManagement />;
//       case "item-code-mapping-management":
//         return <ItemCodeMappingManagement />;
//       case "filter-condition-management":
//         return <FilterConditionManagement />;
//       case "data-format-management":
//         return <DataFormatManagement />;
//       case "system-variable-management":
//         return <SystemVarManagement />;
//       case "user-management":
//         return <UserManagement />;
//       default:
//         // 기본값으로 캠페인 관리 화면을 보여줍니다.
//         return <CampManagement />;
//     }
//   };

//   return (
//     <div className="bg-[#1a1a1a] box-border content-stretch flex flex-row gap-0 items-start justify-center p-0 relative size-full min-h-screen">
//       {/* 
//         사이드바 컴포넌트에 세부 메뉴 상태(currentSubSection)와 
//         이를 변경할 수 있는 핸들러(setCurrentSubSection)를 프롭스로 넘겨줍니다. 
//       */}
//       <TwoLevelSidebar 
//         activeSection={activeSection} 
//         onSectionChange={(section) => {
//           setActiveSection(section);
//           // 💡 UX 팁: 대분류가 바뀔 때 해당 대분류의 첫 번째 서브메뉴가 자동으로 선택되도록 초기화해 주면 좋습니다.
//           if (section === "dashboard") setCurrentSubSection("campaign-management");
//           if (section === "analytics") setCurrentSubSection("analytics");
//         }}
//         currentSubSection={currentSubSection}
//         onSubSectionChange={setCurrentSubSection}
//       />
      
//       {/* 서브 섹션 기준 분기 처리된 메인 콘텐츠 화면 */}
//       {renderContent()}
//     </div>
//   );
// }