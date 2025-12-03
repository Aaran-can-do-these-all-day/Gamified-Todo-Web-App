import { useState, useRef } from 'react';
import { X, Gift, Coins, Star, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

function RewardModal({ onClose, onSubmit, submitting, error, tasks = [] }) {
  const [formState, setFormState] = useState({
    title: '',
    cost: '',
    xpCost: '',
    icon: '🎁',
    expiryDate: '',
    category: 'General',
    image: '',
    requiredTaskId: ''
  });
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('image/')) {
        alert("Please upload an image file");
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        setFormState(prev => ({ ...prev, image: e.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormState(prev => ({ ...prev, image: '' }));
  };

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget && !submitting) {
      onClose();
    }
  };

  const handleSubmit = () => {
    if (!formState.title.trim() || !formState.cost) return;

    onSubmit({
      title: formState.title.trim(),
      cost: parseInt(formState.cost),
      xpCost: formState.xpCost ? parseInt(formState.xpCost) : 0,
      icon: formState.icon,
      expiryDate: formState.expiryDate,
      category: formState.category,
      image: formState.image,
      requiredTaskId: formState.requiredTaskId
    });
  };

  const canSubmit = formState.title.trim() && formState.cost && !isNaN(formState.cost) && parseInt(formState.cost) > 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={handleOverlayMouseDown}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 bg-[#191919] shadow-2xl flex flex-col text-[#d3d3d3]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-purple-400">
              Create New Reward
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reward Title
            </label>
            <input
              type="text"
              value={formState.title}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Watch a Movie"
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>

          {/* Cost Input */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Gold Cost
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Coins className="h-5 w-5 text-yellow-400" />
                </div>
                <input
                  type="number"
                  value={formState.cost}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, cost: e.target.value }))
                  }
                  placeholder="150"
                  min="1"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                XP Cost (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Star className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="number"
                  value={formState.xpCost}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, xpCost: e.target.value }))
                  }
                  placeholder="0"
                  min="0"
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Category & Expiry */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={formState.category}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="General">General</option>
                <option value="Doom Scroll">Doom Scroll</option>
                <option value="Videos">Videos</option>
                <option value="Game">Game</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expiry Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formState.expiryDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, expiryDate: e.target.value }))
                  }
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reward Image
            </label>
            
            {!formState.image ? (
              <div 
                className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer ${
                  dragActive 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-dark-600 hover:border-purple-500/50 hover:bg-dark-700'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
              >
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleChange}
                />
                <div className="w-12 h-12 rounded-full bg-dark-600 flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-300 font-medium">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
                
                <div className="flex items-center gap-2 mt-4 w-full">
                  <div className="h-px bg-dark-600 flex-1" />
                  <span className="text-xs text-gray-500 uppercase">OR</span>
                  <div className="h-px bg-dark-600 flex-1" />
                </div>

                <input
                  type="text"
                  value={formState.image}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, image: e.target.value }))
                  }
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Paste image URL"
                  className="mt-4 w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden border border-dark-600 group">
                <img 
                  src={formState.image} 
                  alt="Preview" 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => inputRef.current?.click()}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Change Image"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                  <button
                    onClick={removeImage}
                    className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                    title="Remove Image"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {/* Required Task */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Required Task (Optional)
            </label>
            <select
              value={formState.requiredTaskId}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, requiredTaskId: e.target.value }))
              }
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">None</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Reward will be locked until this task is completed.
            </p>
          </div>

          {/* Icon Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-6 gap-2">
              {['🎁', '🎮', '📺', '🎬', '🍔', '🍦', '🍕', '☕', '🎧', '📚', '👟', '🏖️'].map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormState((prev) => ({ ...prev, icon }))}
                  className={`p-2 rounded-lg text-xl flex items-center justify-center ${
                    formState.icon === icon
                      ? 'bg-purple-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-[#191919]">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 text-sm font-medium text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-medium text-white transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Star className="w-4 h-4" />
                  Create Reward
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RewardModal;
