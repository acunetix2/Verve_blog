import React, { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Type, Heading1, Heading2, List, Highlighter, Eye, Code2, Terminal, Table } from "lucide-react";
import { toast } from "sonner";

interface ContentBlock {
  id?: string;
  type: 'text' | 'header' | 'subheader' | 'points' | 'highlight' | 'code' | 'command' | 'table';
  content: string;
  color: string;
  language?: string; // for code blocks
  order: number;
}

interface CourseContentEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export const CourseContentEditor: React.FC<CourseContentEditorProps> = ({ blocks, onChange }) => {
  const [preview, setPreview] = useState(false);
  const [selectedColor, setSelectedColor] = useState('slate');

  const colors = {
    slate: { bg: 'bg-slate-100', text: 'text-slate-900', border: 'border-slate-300', darkBg: 'dark:bg-slate-700', darkText: 'dark:text-slate-100' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-900', border: 'border-blue-300', darkBg: 'dark:bg-blue-700', darkText: 'dark:text-blue-100' },
    green: { bg: 'bg-green-100', text: 'text-green-900', border: 'border-green-300', darkBg: 'dark:bg-green-700', darkText: 'dark:text-green-100' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-900', border: 'border-purple-300', darkBg: 'dark:bg-purple-700', darkText: 'dark:text-purple-100' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-900', border: 'border-orange-300', darkBg: 'dark:bg-orange-700', darkText: 'dark:text-orange-100' },
    red: { bg: 'bg-red-100', text: 'text-red-900', border: 'border-red-300', darkBg: 'dark:bg-red-700', darkText: 'dark:text-red-100' },
  };

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: type === 'table' ? '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |' : '',
      color: type === 'header' || type === 'subheader' ? selectedColor : 'slate',
      language: type === 'code' ? 'javascript' : undefined,
      order: blocks.length,
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) {
      return;
    }
    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    onChange(newBlocks.map((block, i) => ({ ...block, order: i })));
  };

  const typeIcons = {
    text: <Type size={16} />,
    header: <Heading1 size={16} />,
    subheader: <Heading2 size={16} />,
    points: <List size={16} />,
    highlight: <Highlighter size={16} />,
    code: <Code2 size={16} />,
    command: <Terminal size={16} />,
    table: <Table size={16} />,
  };

  const typeLabels = {
    text: 'Text',
    header: 'Header',
    subheader: 'Subheader',
    points: 'Points/Bullet',
    highlight: 'Highlight (Green)',
    code: 'Code Block',
    command: 'Command/Terminal',
    table: 'Table',
  };

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-300">Content Preview</h3>
          <button
            onClick={() => setPreview(false)}
            className="text-xs bg-slate-700/50 hover:bg-slate-700/70 text-white px-3 py-1.5 rounded transition-all"
          >
            Edit
          </button>
        </div>

        <div className="space-y-6 bg-slate-900/30 border border-slate-700/50 rounded-lg p-6">
          {blocks.length === 0 ? (
            <p className="text-slate-400 text-sm">No content blocks added yet</p>
          ) : (
            blocks.map((block, idx) => {
              const colorScheme = colors[block.color as keyof typeof colors] || colors.slate;
              if (block.type === 'header') {
                return (
                  <h1 key={idx} className={`text-3xl font-bold ${colorScheme.text} ${colorScheme.darkText}`}>
                    {block.content}
                  </h1>
                );
              }
              if (block.type === 'subheader') {
                return (
                  <h2 key={idx} className={`text-xl font-semibold ${colorScheme.text} ${colorScheme.darkText}`}>
                    {block.content}
                  </h2>
                );
              }
              if (block.type === 'points') {
                return (
                  <div key={idx} className="space-y-2">
                    {block.content.split('\n').filter(l => l.trim()).map((point, pIdx) => (
                      <div key={pIdx} className="flex gap-3">
                        <span className={`text-lg font-bold ${colorScheme.text} ${colorScheme.darkText}`}>•</span>
                        <span className="text-slate-300">{point}</span>
                      </div>
                    ))}
                  </div>
                );
              }
              if (block.type === 'highlight') {
                return (
                  <div key={idx} className="p-4 rounded-lg border-l-4 bg-green-50 border-green-500 dark:bg-green-900/30 dark:border-green-400">
                    <p className="text-green-900 dark:text-green-200">{block.content}</p>
                  </div>
                );
              }
              return (
                <p key={idx} className="text-slate-300 leading-relaxed">
                  {block.content}
                </p>
              );
            })
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => addBlock('header')}
            className="text-xs bg-blue-600/40 hover:bg-blue-600/60 text-blue-300 px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-blue-500/30"
          >
            <Heading1 size={14} /> Header
          </button>
          <button
            onClick={() => addBlock('subheader')}
            className="text-xs bg-purple-600/40 hover:bg-purple-600/60 text-purple-300 px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-purple-500/30"
          >
            <Heading2 size={14} /> Subheader
          </button>
          <button
            onClick={() => addBlock('text')}
            className="text-xs bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-slate-600/50"
          >
            <Type size={14} /> Text
          </button>
          <button
            onClick={() => addBlock('points')}
            className="text-xs bg-green-600/40 hover:bg-green-600/60 text-green-300 px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-green-500/30"
          >
            <List size={14} /> Points
          </button>
          <button
            onClick={() => addBlock('highlight')}
            className="text-xs bg-yellow-600/40 hover:bg-yellow-600/60 text-yellow-300 px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-yellow-500/30"
          >
            <Highlighter size={14} /> Highlight
          </button>
          {/* ✅ New content type buttons */}
          <button
            onClick={() => addBlock('code')}
            className="text-xs bg-green-600/40 hover:bg-green-600/60 text-green-300 px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-green-500/30"
          >
            <Code2 size={14} /> Code
          </button>
          <button
            onClick={() => addBlock('command')}
            className="text-xs bg-cyan-600/40 hover:bg-cyan-600/60 text-cyan-300 px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-cyan-500/30"
          >
            <Terminal size={14} /> Terminal
          </button>
          <button
            onClick={() => addBlock('table')}
            className="text-xs bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-300 px-2.5 py-1.5 rounded transition-all flex items-center gap-1 border border-indigo-500/30"
          >
            <Table size={14} /> Table
          >
            <Highlighter size={14} /> Highlight
          </button>
        </div>
        <button
          onClick={() => setPreview(true)}
          className="text-xs bg-slate-700/50 hover:bg-slate-700/70 text-white px-3 py-1.5 rounded transition-all flex items-center gap-1"
        >
          <Eye size={14} /> Preview
        </button>
      </div>

      {/* Color Selector for Headers */}
      <div className="mb-4 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
        <p className="text-xs text-slate-400 mb-2">Header/Subheader Color</p>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(colors).map(([color, colorScheme]) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-6 h-6 rounded border-2 transition-all ${
                colorScheme.bg
              } ${selectedColor === color ? 'border-white' : 'border-transparent'}`}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Content Blocks */}
      <div className="space-y-2">
        {blocks.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-700/50 rounded-lg">
            <p className="text-slate-400 text-xs">No content blocks yet. Start adding content above!</p>
          </div>
        ) : (
          blocks.map((block, index) => {
            const colorScheme = colors[block.color as keyof typeof colors] || colors.slate;
            return (
              <div
                key={index}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 space-y-3"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-slate-400">{typeIcons[block.type]}</span>
                      <span className="text-xs text-slate-300 font-medium">{typeLabels[block.type]}</span>
                      {(block.type === 'header' || block.type === 'subheader') && (
                        <span className={`text-xs px-2 py-0.5 rounded ${colorScheme.bg} ${colorScheme.text}`}>
                          {block.color}
                        </span>
                      )}
                    </div>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(index, { content: e.target.value })}
                      placeholder={
                        block.type === 'points'
                          ? 'Enter points separated by lines...'
                          : 'Enter content...'
                      }
                      className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 px-3 py-2 rounded text-xs resize-none min-h-20 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  </div>

                  {/* Control Buttons */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all"
                      title="Move up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all"
                      title="Move down"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      onClick={() => removeBlock(index)}
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CourseContentEditor;
